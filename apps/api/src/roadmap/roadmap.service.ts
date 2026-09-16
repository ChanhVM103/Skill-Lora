import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import ytSearch from 'yt-search';
import {
  CurrentLevel,
  GapCategory,
  GapSeverity,
  GenerateRoadmapRequestDto,
  ResourceDifficulty,
  RoadmapGapItemDto,
  RoadmapResourceDto,
  StartingLevel,
  TargetLevel,
} from './dto/generate-roadmap-request.dto.js';
import {
  ExternalCourseSuggestionDto,
  FourWeekLessonDto,
  FourWeekPlanDto,
  ImprovementItemDto,
  LessonSource,
  AiGenerationStatus,
  ResourceGapAlertDto,
  ResourceStatus,
  RoadmapPhaseDto,
  RoadmapResponseDto,
  RoadmapStepDto,
  RoadmapStepType,
} from './dto/roadmap-response.dto.js';
import { phaseOrder, phaseTemplates } from './config/phase-templates.config.js';
import {
  currentLevelWeight,
  difficultyByCurrentLevel,
  severityWeight,
} from './config/roadmap-rules.config.js';
import { roleProfiles } from './config/role-profiles.config.js';
import { skillTaxonomy } from './config/skill-taxonomy.config.js';
import {
  genericSkillTemplate,
  skillTemplates,
} from './config/skill-templates.config.js';

type ScoredGap = RoadmapGapItemDto & {
  improvement_score: number;
  roleImportance: number;
  recommended_week: number;
};

type MatchedResources = {
  status: ResourceStatus;
  resourceIds: string[];
  fallbackAction: string | null;
};

@Injectable()
export class RoadmapService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async generateRoadmap(
    request: GenerateRoadmapRequestDto,
  ): Promise<RoadmapResponseDto> {
    const startingLevel = request.starting_level ?? StartingLevel.Beginner;
    const resources = request.resources ?? [];
    const scoredGaps = this.assignWeeks(
      this.withTransitionGapIfNeeded(this.scoreGaps(request), startingLevel),
    );
    const improvementItems = this.toImprovementItems(scoredGaps);
    const phases = this.buildPhases(scoredGaps, resources);
    const externalCourseSuggestions = this.buildExternalCourseSuggestions(scoredGaps);
    const fallbackFourWeekPlan = this.buildFallbackFourWeekPlan(
      scoredGaps,
      resources,
      externalCourseSuggestions,
    );
    const resourceGapAlerts = this.buildResourceGapAlerts(
      request,
      phases,
      scoredGaps,
    );

    const cacheKey = `ai_plan_${request.target_role}_${startingLevel}_${improvementItems.map((i) => i.skill_id).sort().join('_')}`;
    const cachedPlan = await this.cacheManager.get<FourWeekPlanDto[]>(cacheKey);

    const aiPrompt = this.buildGeminiPrompt(
      request,
      improvementItems,
    );

    let aiGeneration: {
      plan: FourWeekPlanDto[] | null;
      status: AiGenerationStatus;
      error: string | null;
    };

    if (cachedPlan) {
      aiGeneration = {
        plan: cachedPlan,
        status: AiGenerationStatus.Generated,
        error: null,
      };
    } else {
      aiGeneration = await this.generateGeminiFourWeekPlan(
        aiPrompt,
        improvementItems,
        fallbackFourWeekPlan,
      );

      // Only cache if the plan was successfully generated and not the fallback
      if (aiGeneration.plan && aiGeneration.status === AiGenerationStatus.Generated) {
        await this.cacheManager.set(cacheKey, aiGeneration.plan, 1000 * 60 * 60 * 24 * 7); // Cache for 7 days
      }
    }

    const finalPlan = await this.populateYouTubeVideos(
      aiGeneration.plan ?? fallbackFourWeekPlan,
    );

    return {
      roadmap_id: this.createRoadmapId(request.target_role),
      target_role: request.target_role,
      starting_level: startingLevel,
      estimated_duration_weeks: 4,
      improvement_items: improvementItems,
      phases,
      four_week_plan: finalPlan,
      lesson_source: aiGeneration.plan
        ? LessonSource.AiGenerated
        : LessonSource.BackendFallback,
      ai_generation_status: aiGeneration.status,
      ai_prompt: aiPrompt,
      ai_generation_error: aiGeneration.error,
      resource_gap_alerts: resourceGapAlerts,
    };
  }
  private scoreGaps(request: GenerateRoadmapRequestDto): ScoredGap[] {
    const roleProfile = roleProfiles[request.target_role];

    return request.gap_items
      .map((gap) => {
        const roleSkill = roleProfile.requiredSkills.find(
          (skill) => skill.skillId === gap.skill_id,
        );
        const roleImportance = roleSkill?.importance ?? 1;
        const prerequisiteBoost = this.hasPrerequisites(gap.skill_id) ? 1 : 0;

        return {
          ...gap,
          improvement_score:
            severityWeight[gap.severity] +
            currentLevelWeight[gap.current_level] +
            roleImportance +
            prerequisiteBoost,
          roleImportance,
          recommended_week: 1,
        };
      })
      .sort((a, b) => b.improvement_score - a.improvement_score);
  }

  private withTransitionGapIfNeeded(
    gaps: ScoredGap[],
    startingLevel: StartingLevel,
  ): ScoredGap[] {
    if (startingLevel !== StartingLevel.NonItTransition) {
      return gaps;
    }

    const alreadyHasTransition = gaps.some(
      (gap) => gap.category === GapCategory.Transition,
    );

    if (alreadyHasTransition) {
      return gaps;
    }

    return [
      {
        skill_id: 'career_transition_foundations',
        skill_name: 'Career Transition Foundations',
        category: GapCategory.Transition,
        severity: GapSeverity.High,
        current_level: CurrentLevel.Missing,
        target_level: TargetLevel.Basic,
        reason:
          'The student is starting from a different background and needs baseline foundations before role-specific skills.',
        improvement_score: 99,
        roleImportance: 5,
        recommended_week: 1,
      },
      ...gaps,
    ];
  }

  private assignWeeks(gaps: ScoredGap[]): ScoredGap[] {
    return gaps.map((gap, index) => ({
      ...gap,
      recommended_week: Math.min(4, index + 1),
    }));
  }

  private toImprovementItems(gaps: ScoredGap[]): ImprovementItemDto[] {
    return gaps.map((gap) => ({
      skill_id: gap.skill_id,
      skill_name: gap.skill_name,
      category: gap.category,
      improvement_score: gap.improvement_score,
      role_importance: gap.roleImportance,
      recommended_week: gap.recommended_week,
      severity: gap.severity,
      current_level: gap.current_level,
      reason: gap.reason,
    }));
  }

  private buildPhases(
    gaps: ScoredGap[],
    resources: RoadmapResourceDto[],
  ): RoadmapPhaseDto[] {
    let phaseNumber = 1;

    return phaseOrder
      .map((phaseKey) => {
        const phaseGaps = gaps.filter((gap) => gap.category === phaseKey);

        if (phaseGaps.length === 0) {
          return null;
        }

        const template = phaseTemplates[phaseKey];
        const steps = phaseGaps.flatMap((gap) =>
          this.buildStepsForGap(gap, resources),
        );

        const phase: RoadmapPhaseDto = {
          phase: phaseNumber,
          key: phaseKey,
          title: template.title,
          duration_weeks: Math.max(
            1,
            Math.min(4, this.estimatePhaseDuration(template.baseDurationWeeks, phaseGaps)),
          ),
          focus_skills: phaseGaps.map((gap) => gap.skill_name),
          why_this_phase: this.buildPhaseReason(template.description, phaseGaps),
          steps,
        };

        phaseNumber += 1;
        return phase;
      })
      .filter((phase): phase is RoadmapPhaseDto => phase !== null);
  }

  private buildStepsForGap(
    gap: ScoredGap,
    resources: RoadmapResourceDto[],
  ): RoadmapStepDto[] {
    const skillTemplate = skillTemplates[gap.skill_id] ?? genericSkillTemplate;
    const stepTypes = this.getStepTypes(gap);

    return stepTypes.map((type, index) => {
      const matchedResources = this.matchResources(gap, resources);

      return {
        step_id: this.createStepId(gap.skill_id, type, index),
        type,
        title: this.getStepTitle(type, skillTemplate),
        skill_id: gap.skill_id,
        skill_name: gap.skill_name,
        resource_status: matchedResources.status,
        resources: matchedResources.resourceIds,
        deliverable:
          type === RoadmapStepType.Deliverable ? skillTemplate.deliverable : null,
        fallback_action: matchedResources.fallbackAction,
      };
    });
  }

  private getStepTypes(gap: ScoredGap): RoadmapStepType[] {
    if (
      gap.severity === GapSeverity.High &&
      gap.current_level === CurrentLevel.Missing
    ) {
      return [
        RoadmapStepType.Theory,
        RoadmapStepType.Practice,
        RoadmapStepType.Assessment,
        RoadmapStepType.Deliverable,
      ];
    }

    if (
      gap.severity === GapSeverity.Medium ||
      gap.current_level === CurrentLevel.Partial
    ) {
      return [
        RoadmapStepType.Practice,
        RoadmapStepType.Assessment,
        RoadmapStepType.Deliverable,
      ];
    }

    return [RoadmapStepType.Review, RoadmapStepType.Practice];
  }

  private getStepTitle(
    type: RoadmapStepType,
    skillTemplate: typeof genericSkillTemplate,
  ): string {
    const titles: Record<RoadmapStepType, string> = {
      [RoadmapStepType.Theory]: skillTemplate.theory,
      [RoadmapStepType.Practice]: skillTemplate.practice,
      [RoadmapStepType.Assessment]: skillTemplate.assessment,
      [RoadmapStepType.Deliverable]: `Create deliverable: ${skillTemplate.deliverable}`,
      [RoadmapStepType.Review]: `Review: ${skillTemplate.theory}`,
    };

    return titles[type];
  }

  private buildFallbackFourWeekPlan(
    gaps: ScoredGap[],
    resources: RoadmapResourceDto[],
    externalCourses: ExternalCourseSuggestionDto[],
  ): FourWeekPlanDto[] {
    return [1, 2, 3, 4].map((week) => {
      const weekGaps = gaps.filter((gap) => gap.recommended_week === week);
      const fallbackGaps = weekGaps.length > 0 ? weekGaps : gaps.slice(0, 1);

      return {
        week,
        theme: this.buildWeekTheme(week, fallbackGaps),
        focus_skills: fallbackGaps.map((gap) => gap.skill_name),
        lessons: fallbackGaps.map((gap, index) =>
          this.buildFallbackLesson(week, index, gap, resources, externalCourses),
        ),
      };
    });
  }

  private buildFallbackLesson(
    week: number,
    index: number,
    gap: ScoredGap,
    resources: RoadmapResourceDto[],
    externalCourses: ExternalCourseSuggestionDto[],
  ): FourWeekLessonDto {
    const skillTemplate = skillTemplates[gap.skill_id] ?? genericSkillTemplate;
    const matchedResources = this.matchResources(gap, resources);

    return {
      lesson_id: `lesson_week_${week}_${gap.skill_id}_${index + 1}`,
      title: `${gap.skill_name}: ${this.lessonTitleByWeek(week)}`,
      skill_id: gap.skill_id,
      skill_name: gap.skill_name,
      activity: skillTemplate.theory,
      practice: skillTemplate.practice,
      deliverable: skillTemplate.deliverable,
      teacher_resources: matchedResources.resourceIds,
      external_courses: externalCourses.filter(
        (course) => course.skill_id === gap.skill_id,
      ),
    };
  }

  private buildExternalCourseSuggestions(
    gaps: ScoredGap[],
  ): ExternalCourseSuggestionDto[] {
    const providers = [
      { name: 'Coursera', baseUrl: 'https://www.coursera.org/search?query=' },
      { name: 'edX', baseUrl: 'https://www.edx.org/search?q=' },
      { name: 'Udemy', baseUrl: 'https://www.udemy.com/courses/search/?q=' },
      { name: 'YouTube', baseUrl: 'https://www.youtube.com/results?search_query=' },
    ];

    return gaps.flatMap((gap) =>
      providers.map((provider) => {
        const query = `${gap.skill_name} ${this.difficultyLabel(gap)} course`;
        return {
          skill_id: gap.skill_id,
          skill_name: gap.skill_name,
          provider: provider.name,
          search_query: query,
          search_url: `${provider.baseUrl}${encodeURIComponent(query)}`,
          note:
            'Optional external course search. Prefer teacher resources when available.',
        };
      }),
    );
  }

  private buildGeminiPrompt(
    request: GenerateRoadmapRequestDto,
    improvementItems: ImprovementItemDto[],
  ): string {
    const roleProfile = roleProfiles[request.target_role];
    const optimizedItems = improvementItems.map((item) => ({
      id: item.skill_id,
      name: item.skill_name,
      week: item.recommended_week,
    }));
    const payload = {
      role: roleProfile.displayName,
      level: request.starting_level ?? StartingLevel.Beginner,
      skills_to_learn: optimizedItems,
      rules: [
        'Do not add skills not listed in skills_to_learn.',
        'Use the provided week as the start week for each skill.',
        'Generate exactly 1 lesson per week.',
        'For each lesson, you MUST provide exactly 1 youtube_search_query that strictly matches the lesson\'s specific topic.',
        'Return valid JSON only. No markdown.',
      ],
      expected_json: {
        weeks: [
          {
            week: 1,
            theme: 'string',
            focus_skills: ['string'],
            lessons: [
              {
                title: 'string',
                skill_id: 'string (must match original skill_id from input)',
                skill_name: 'string',
                activity: 'string',
                practice: 'string',
                deliverable: 'string',
                youtube_search_query: 'string',
              },
            ],
          },
        ],
      },
    };

    return `Generate a 4-week learning roadmap based on this payload: ${JSON.stringify(payload)}`;
  }

  private async generateGeminiFourWeekPlan(
    prompt: string,
    improvementItems: ImprovementItemDto[],
    fallbackPlan: FourWeekPlanDto[],
  ): Promise<{
    plan: FourWeekPlanDto[] | null;
    status: AiGenerationStatus;
    error: string | null;
  }> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        plan: null,
        status: AiGenerationStatus.NotConfigured,
        error: 'GEMINI_API_KEY is not configured.',
      };
    }

    try {
      const model = process.env.GEMINI_MODEL ?? 'gemini-3.6-flash';
      let response: Response | undefined;
      let attempt = 0;
      const maxRetries = 3;

      while (attempt < maxRetries) {
        try {
          response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [{ text: prompt }],
                  },
                ],
                generationConfig: {
                  response_mime_type: 'application/json',
                  temperature: 0.4,
                },
              }),
            },
          );

          if (response.ok) {
            break; // Success
          }

          if (response.status === 503 || response.status === 429) {
            attempt++;
            if (attempt < maxRetries) {
              await new Promise((res) => setTimeout(res, 2000 * attempt));
              continue;
            }
          }
          break; // Break on other errors or max retries
        } catch (fetchError) {
          attempt++;
          if (attempt >= maxRetries) throw fetchError;
          await new Promise((res) => setTimeout(res, 2000 * attempt));
        }
      }

      if (!response || !response.ok) {
        const errorText = response ? await response.text() : 'Network error or max retries exceeded.';
        const statusCode = response ? response.status : 500;
        return {
          plan: null,
          status: AiGenerationStatus.RequestFailed,
          error: this.sanitizeGeminiError(statusCode, errorText),
        };
      }

      const body = (await response.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
      };
      const text = body.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        return {
          plan: null,
          status: AiGenerationStatus.EmptyResponse,
          error: 'Gemini returned an empty response.',
        };
      }

      const parsed = this.parseGeminiJson(text);
      const plan = this.toFourWeekPlanFromGemini(parsed, fallbackPlan);

      if (!this.isValidAiPlan(plan, improvementItems)) {
        return {
          plan: null,
          status: AiGenerationStatus.ValidationFailed,
          error: 'Gemini response did not pass roadmap validation.',
        };
      }

      return { plan, status: AiGenerationStatus.Generated, error: null };
    } catch {
      return {
        plan: null,
        status: AiGenerationStatus.InvalidJson,
        error: 'Gemini response was not valid JSON.',
      };
    }
  }

  private sanitizeGeminiError(status: number, errorText: string): string {
    try {
      const parsed = JSON.parse(errorText) as {
        error?: { message?: string; status?: string };
      };
      const message = parsed.error?.message ?? 'Unknown Gemini error';
      const geminiStatus = parsed.error?.status ? ` (${parsed.error.status})` : '';
      return `Gemini request failed with HTTP ${status}${geminiStatus}: ${message}`;
    } catch {
      return `Gemini request failed with HTTP ${status}: ${errorText.slice(0, 300)}`;
    }
  }
  private parseGeminiJson(text: string): unknown {
    const trimmed = text.trim();
    const withoutFence = trimmed
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    return JSON.parse(withoutFence);
  }

  private toFourWeekPlanFromGemini(
    parsed: unknown,
    fallbackPlan: FourWeekPlanDto[],
  ): FourWeekPlanDto[] {
    const payload = parsed as {
      weeks?: Array<{
        week?: number;
        theme?: string;
        focus_skills?: string[];
        lessons?: Array<{
          title?: string;
          skill_id?: string;
          skill_name?: string;
          activity?: string;
          practice?: string;
          deliverable?: string;
          youtube_search_query?: string;
        }>;
      }>;
    };

    if (!Array.isArray(payload.weeks)) {
      return fallbackPlan;
    }

    return payload.weeks.map((week, weekIndex) => ({
      week: week.week ?? weekIndex + 1,
      theme: week.theme ?? fallbackPlan[weekIndex]?.theme ?? `Week ${weekIndex + 1}`,
      focus_skills: Array.isArray(week.focus_skills) ? week.focus_skills : [],
      lessons: Array.isArray(week.lessons)
        ? week.lessons.map((lesson, lessonIndex) => ({
            lesson_id: `ai_lesson_week_${week.week ?? weekIndex + 1}_${lessonIndex + 1}`,
            title: lesson.title ?? 'Learning activity',
            skill_id: lesson.skill_id ?? '',
            skill_name: lesson.skill_name ?? '',
            activity: lesson.activity ?? '',
            practice: lesson.practice ?? '',
            deliverable: lesson.deliverable ?? '',
            teacher_resources: [],
            external_courses: lesson.youtube_search_query
              ? [
                  {
                    skill_id: lesson.skill_id ?? '',
                    skill_name: lesson.skill_name ?? '',
                    provider: 'YouTube Search Query',
                    search_query: lesson.youtube_search_query,
                    search_url: '',
                    note: 'Internal query to be resolved',
                  },
                ]
              : [],
          }))
        : [],
    }));
  }

  private isValidAiPlan(
    plan: FourWeekPlanDto[],
    improvementItems: ImprovementItemDto[],
  ): boolean {
    if (plan.length !== 4) {
      return false;
    }

    const allowedSkillIds = new Set(
      improvementItems.map((item) => item.skill_id),
    );

    return plan.every((week) => {
      if (week.week < 1 || week.week > 4 || week.lessons.length === 0) {
        return false;
      }

      return week.lessons.every((lesson) => {
        if (!allowedSkillIds.has(lesson.skill_id)) {
          return false;
        }
        return true;
      });
    });
  }

  private async populateYouTubeVideos(
    plan: FourWeekPlanDto[],
  ): Promise<FourWeekPlanDto[]> {
    const fetchPromises = plan.flatMap((week) =>
      week.lessons.map(async (lesson) => {
        if (
          !lesson.external_courses ||
          lesson.external_courses.length === 0 ||
          lesson.external_courses[0].provider !== 'YouTube Search Query'
        ) {
          return;
        }

        const query = lesson.external_courses[0].search_query;
        let videos = await this.cacheManager.get<any[]>(`yt_${query}`);

        if (!videos) {
          try {
            const result = await ytSearch(query);
            videos = result.videos.slice(0, 3).map((v) => ({
              title: v.title,
              url: v.url,
            }));
            await this.cacheManager.set(`yt_${query}`, videos, 1000 * 60 * 60 * 24); // Cache 1 day
          } catch (e) {
            videos = [];
          }
        }

        lesson.external_courses = (videos || []).map((v) => ({
          skill_id: lesson.skill_id,
          skill_name: lesson.skill_name,
          provider: 'YouTube',
          search_query: query,
          search_url: v.url,
          note: v.title,
        }));
      }),
    );

    await Promise.all(fetchPromises);
    return plan;
  }

  private matchResources(
    gap: ScoredGap,
    resources: RoadmapResourceDto[],
  ): MatchedResources {
    const neededDifficulty = difficultyByCurrentLevel[gap.current_level];
    const normalizedSkillId = this.normalize(gap.skill_id);
    const normalizedSkillName = this.normalize(gap.skill_name);

    const directMatches = resources.filter((resource) =>
      resource.skill_tags.some((tag) => {
        const normalizedTag = this.normalize(tag);
        return (
          normalizedTag === normalizedSkillId ||
          normalizedTag === normalizedSkillName
        );
      }),
    );

    const difficultyMatches = directMatches.filter(
      (resource) => resource.difficulty === neededDifficulty,
    );

    if (difficultyMatches.length > 0) {
      return {
        status: ResourceStatus.Matched,
        resourceIds: difficultyMatches.map((resource) => resource.id),
        fallbackAction: null,
      };
    }

    if (directMatches.length > 0) {
      return {
        status: ResourceStatus.PartialMatch,
        resourceIds: directMatches.map((resource) => resource.id),
        fallbackAction: null,
      };
    }

    return {
      status: ResourceStatus.MissingInternalResource,
      resourceIds: [],
      fallbackAction: `Ask a teacher to add a ${neededDifficulty} resource for ${gap.skill_name}.`,
    };
  }

  private buildResourceGapAlerts(
    request: GenerateRoadmapRequestDto,
    phases: RoadmapPhaseDto[],
    gaps: ScoredGap[],
  ): ResourceGapAlertDto[] {
    const missingSkillIds = new Set(
      phases
        .flatMap((phase) => phase.steps)
        .filter(
          (step) =>
            step.resource_status === ResourceStatus.MissingInternalResource,
        )
        .map((step) => step.skill_id),
    );

    return gaps
      .filter((gap) => missingSkillIds.has(gap.skill_id))
      .map((gap) => ({
        skill_id: gap.skill_id,
        skill_name: gap.skill_name,
        target_role: request.target_role,
        needed_difficulty: difficultyByCurrentLevel[gap.current_level],
        reason:
          'No matching teacher resource found for one or more roadmap steps.',
      }));
  }

  private estimatePhaseDuration(baseDurationWeeks: number, gaps: ScoredGap[]): number {
    const highSeverityCount = gaps.filter(
      (gap) => gap.severity === GapSeverity.High,
    ).length;
    const missingCount = gaps.filter(
      (gap) => gap.current_level === CurrentLevel.Missing,
    ).length;

    return baseDurationWeeks + Math.ceil((highSeverityCount + missingCount) / 2);
  }

  private buildPhaseReason(phaseDescription: string, gaps: ScoredGap[]): string {
    const highPrioritySkills = gaps
      .slice(0, 3)
      .map((gap) => gap.skill_name)
      .join(', ');

    return `${phaseDescription} Focus skills: ${highPrioritySkills}.`;
  }

  private buildWeekTheme(week: number, gaps: ScoredGap[]): string {
    const firstSkill = gaps[0]?.skill_name ?? 'Core Skill';
    const themes: Record<number, string> = {
      1: `${firstSkill} Foundations`,
      2: `${firstSkill} Guided Practice`,
      3: `${firstSkill} Applied Work`,
      4: `${firstSkill} Portfolio Deliverable`,
    };

    return themes[week];
  }

  private lessonTitleByWeek(week: number): string {
    const titles: Record<number, string> = {
      1: 'Foundation Concepts',
      2: 'Guided Practice',
      3: 'Applied Practice',
      4: 'Portfolio Deliverable',
    };

    return titles[week];
  }

  private difficultyLabel(gap: ScoredGap): string {
    const difficultyByLevel: Record<CurrentLevel, ResourceDifficulty> = {
      [CurrentLevel.Missing]: ResourceDifficulty.Beginner,
      [CurrentLevel.Partial]: ResourceDifficulty.Intermediate,
      [CurrentLevel.WeakEvidence]: ResourceDifficulty.Beginner,
    };

    return difficultyByLevel[gap.current_level];
  }

  private hasPrerequisites(skillId: string): boolean {
    return (skillTaxonomy[skillId]?.prerequisites.length ?? 0) > 0;
  }

  private normalize(value: string): string {
    return value.trim().toLowerCase().replace(/[\s-]+/g, '_');
  }

  private createRoadmapId(targetRole: string): string {
    return `roadmap_${targetRole}_${Date.now()}`;
  }

  private createStepId(
    skillId: string,
    type: RoadmapStepType,
    index: number,
  ): string {
    return `step_${skillId}_${type}_${index + 1}`;
  }
}