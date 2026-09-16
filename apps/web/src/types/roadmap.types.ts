export type TargetRole =
  | 'data_analyst'
  | 'backend_developer'
  | 'ai_engineer'
  | 'digital_marketing_specialist';

export type StartingLevel =
  | 'non_it_transition'
  | 'beginner'
  | 'intermediate'
  | 'role_ready';

export type GapCategory =
  | 'transition'
  | 'foundation'
  | 'core'
  | 'applied_project'
  | 'portfolio';

export type GapSeverity = 'high' | 'medium' | 'low';

export type CurrentLevel = 'missing' | 'partial' | 'weak_evidence';

export type TargetLevel = 'basic' | 'intermediate' | 'advanced' | 'portfolio';

export type ResourceType =
  | 'lecture'
  | 'assignment'
  | 'article'
  | 'video'
  | 'project'
  | 'quiz';

export type ResourceDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface RoadmapGapItem {
  skill_id: string;
  skill_name: string;
  category: GapCategory;
  severity: GapSeverity;
  current_level: CurrentLevel;
  target_level: TargetLevel;
  reason?: string;
}

export interface RoadmapResource {
  id: string;
  title: string;
  type: ResourceType;
  skill_tags: string[];
  difficulty: ResourceDifficulty;
  url?: string;
}

export interface GenerateRoadmapRequest {
  target_role: TargetRole;
  starting_level?: StartingLevel;
  gap_items: RoadmapGapItem[];
  resources?: RoadmapResource[];
}

export interface ExternalCourseSuggestion {
  skill_id: string;
  skill_name: string;
  provider: string;
  search_query: string;
  search_url: string;
  note: string;
}

export interface RoadmapStep {
  step_id: string;
  type: 'theory' | 'practice' | 'assessment' | 'deliverable' | 'review';
  title: string;
  skill_id: string;
  skill_name: string;
  resource_status: 'matched' | 'partial_match' | 'missing_internal_resource';
  resources: string[];
  deliverable?: string | null;
  fallback_action?: string | null;
}

export interface RoadmapPhase {
  phase: number;
  key: GapCategory;
  title: string;
  duration_weeks: number;
  focus_skills: string[];
  why_this_phase: string;
  steps: RoadmapStep[];
}

export interface FourWeekLesson {
  lesson_id: string;
  title: string;
  skill_id: string;
  skill_name: string;
  activity: string;
  practice: string;
  deliverable: string;
  teacher_resources: string[];
  external_courses: ExternalCourseSuggestion[];
}

export interface FourWeekPlan {
  week: number;
  theme: string;
  focus_skills: string[];
  lessons: FourWeekLesson[];
}

export interface ResourceGapAlert {
  skill_id: string;
  skill_name: string;
  target_role: TargetRole;
  needed_difficulty: ResourceDifficulty;
  reason: string;
}

export interface ImprovementItem {
  skill_id: string;
  skill_name: string;
  category: GapCategory;
  improvement_score: number;
  role_importance: number;
  recommended_week: number;
  severity: string;
  current_level: string;
  reason?: string;
}

export interface RoadmapResponse {
  roadmap_id: string;
  target_role: TargetRole;
  starting_level: StartingLevel;
  estimated_duration_weeks: number;
  improvement_items: ImprovementItem[];
  phases: RoadmapPhase[];
  four_week_plan: FourWeekPlan[];
  lesson_source: 'backend_fallback' | 'ai_generated';
  ai_generation_status: string;
  ai_prompt: string;
  ai_generation_error?: string | null;
  resource_gap_alerts: ResourceGapAlert[];
}
