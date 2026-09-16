import { Injectable, Logger } from '@nestjs/common';
import { getAvailableApiKeys } from '../../../common/constant/app.constant.js';
import { BaselineParseResult } from './baseline-parser.service.js';

export interface GeneratedQuestionItem {
  question_id: string;
  axis: 'technology' | 'system' | 'people' | 'process';
  target_level_benchmark: string;
  project_referenced: string;
  feature_referenced: string;
  question_text: string;
  verification_goal: string;
}

export interface GeneratedQuestionsResult {
  total_questions: number;
  target_role: string;
  hypothesis_level_under_test: string;
  questions: GeneratedQuestionItem[];
}

@Injectable()
export class QuestionGeneratorService {
  private readonly logger = new Logger(QuestionGeneratorService.name);

  /**
   * Sinh bộ 8 câu hỏi phỏng vấn động (Step 2) – Mỗi trục 2 câu hỏi
   */
  async generateQuestions(
    baseline: BaselineParseResult,
    targetRole: string,
  ): Promise<GeneratedQuestionsResult> {
    this.logger.log(
      `Generating 8 questions for target_role: ${targetRole}, hypothesis_level: ${baseline.hypothesis_level_calculation?.estimated_level}`,
    );

    const apiKeys = getAvailableApiKeys();

    if (apiKeys.length > 0) {
      try {
        const googleGenAI = await import('@google/generative-ai' as any);
        const GoogleGenerativeAI = googleGenAI.GoogleGenerativeAI;

        const prompt = `
You are a Principal Software Architect and Senior Technical Interviewer.
Your goal is to generate EXACTLY 8 deep behavioral & technical interview questions across 4 Engineering Ladder Axes (EXACTLY 2 QUESTIONS PER AXIS):

1. Technology Axis (2 Questions: q_1, q_2):
   - q_1: Deep-dive into runtime bugs, core library issues, and performance optimization in features they built.
   - q_2: Advanced framework usage, type safety, state management, or memory/resource management.

2. System Axis (2 Questions: q_3, q_4):
   - q_3: 5x traffic bottleneck design, infrastructure scaling, and database/network bottlenecks.
   - q_4: System architecture ownership, caching strategy (Redis/CDN), and data flow design.

3. People Axis (2 Questions: q_5, q_6):
   - q_5: Resolving technical/architectural trade-off conflicts with team members or POs.
   - q_6: Code review feedback culture, mentoring junior members, or knowledge sharing.

4. Process Axis (2 Questions: q_7, q_8):
   - q_7: CI/CD automation pipelines, static code analysis (ESLint/TypeScript check), and automated testing.
   - q_8: Release strategy (Zero-downtime, Canary/Blue-Green, Feature flags) and risk management.

BASELINE CONTEXT FROM STEP 1:
- Target Role: "${targetRole}"
- Hypothesis Level: "${baseline.hypothesis_level_calculation?.estimated_level || 'Mid-Level'}"
- Primary Domain Stack: ${JSON.stringify(baseline.primary_domain_stack)}
- Key Projects & Detailed Features: ${JSON.stringify(baseline.key_projects_detailed_audit)}
- Credentials & Languages: ${JSON.stringify(baseline.certifications_and_languages)}

STRICT RULES FOR GENERATION:
1. GENERATE EXACTLY 8 QUESTIONS (2 for technology, 2 for system, 2 for people, 2 for process).
2. IMPORTANT LANGUAGE RULE: ALL GENERATED QUESTION TEXT AND VERIFICATION GOALS MUST BE IN PROFESSIONAL TECHNICAL ENGLISH.
3. TARGET ROLE FOCUS: Tailor heavily to "${targetRole}" (e.g. React/NextJS for frontend_reactjs, NestJS/Redis for backend_nestjs).
4. ADAPTIVE LEVEL CALIBRATION:
   - If Fresher / Intern: Focus on CS fundamentals, basic debugging steps, reading docs, code quality, and team collaboration.
   - If Mid / Senior: Focus on architecture trade-offs, race conditions, 5x traffic bottleneck, CI/CD safety, and technical negotiation.
5. SPECIFIC PROJECT & FEATURE REFERENCES: Reference exact project names and feature titles from candidate's CV.

OUTPUT STRICTLY VALID JSON:
{
  "total_questions": 8,
  "target_role": "${targetRole}",
  "hypothesis_level_under_test": "${baseline.hypothesis_level_calculation?.estimated_level || 'Mid-Level'}",
  "questions": [
    {
      "question_id": "q_1",
      "axis": "technology",
      "target_level_benchmark": "Level 2",
      "project_referenced": "Project Name",
      "feature_referenced": "Feature Name",
      "question_text": "Detailed technical question in English...",
      "verification_goal": "What specific hands-on evidence this tests in English"
    },
    {
      "question_id": "q_2",
      "axis": "technology",
      "target_level_benchmark": "Level 2",
      "project_referenced": "Project Name",
      "feature_referenced": "Feature Name",
      "question_text": "Detailed technical question in English...",
      "verification_goal": "Testing framework internals in English"
    },
    {
      "question_id": "q_3",
      "axis": "system",
      "target_level_benchmark": "Level 2",
      "project_referenced": "Project Name",
      "feature_referenced": "Feature Name",
      "question_text": "Detailed technical question in English...",
      "verification_goal": "Testing 5x bottleneck analysis in English"
    },
    {
      "question_id": "q_4",
      "axis": "system",
      "target_level_benchmark": "Level 2",
      "project_referenced": "Project Name",
      "feature_referenced": "Feature Name",
      "question_text": "Detailed technical question in English...",
      "verification_goal": "Testing caching & data flow in English"
    },
    {
      "question_id": "q_5",
      "axis": "people",
      "target_level_benchmark": "Level 2",
      "project_referenced": "Project Name",
      "feature_referenced": "Feature Name",
      "question_text": "Detailed technical question in English...",
      "verification_goal": "Testing conflict resolution in English"
    },
    {
      "question_id": "q_6",
      "axis": "people",
      "target_level_benchmark": "Level 2",
      "project_referenced": "Project Name",
      "feature_referenced": "Feature Name",
      "question_text": "Detailed technical question in English...",
      "verification_goal": "Testing code review & mentoring in English"
    },
    {
      "question_id": "q_7",
      "axis": "process",
      "target_level_benchmark": "Level 2",
      "project_referenced": "Project Name",
      "feature_referenced": "Feature Name",
      "question_text": "Detailed technical question in English...",
      "verification_goal": "Testing CI/CD pipeline automation in English"
    },
    {
      "question_id": "q_8",
      "axis": "process",
      "target_level_benchmark": "Level 2",
      "project_referenced": "Project Name",
      "feature_referenced": "Feature Name",
      "question_text": "Detailed technical question in English...",
      "verification_goal": "Testing release safety & testing in English"
    }
  ]
}
`;

        const candidateModels = [
          'gemini-3.6-flash',
          'gemini-2.0-flash-exp',
          'gemini-1.5-flash-latest',
          'gemini-2.0-flash',
          'gemini-1.5-flash',
          'gemini-1.5-pro',
        ];

        for (const apiKey of apiKeys) {
          const genAI = new GoogleGenerativeAI(apiKey);
          for (const modelName of candidateModels) {
            try {
              const model = genAI.getGenerativeModel({ model: modelName });
              const response = await model.generateContent([prompt]);
              const textRes = response.response.text();
              const cleaned = this.cleanJsonResponse(textRes);
              const parsed = JSON.parse(cleaned);
              this.logger.log(
                `Successfully generated ${parsed.questions?.length || 0} questions via AI LLM using model ${modelName}.`,
              );
              return parsed as GeneratedQuestionsResult;
            } catch (err) {
              this.logger.warn(
                `Model ${modelName} with API Key (...${apiKey.slice(-6)}) failed: ${err instanceof Error ? err.message : String(err)}. Trying next...`,
              );
            }
          }
        }
      } catch (err) {
        this.logger.warn(
          `AI Question Generator failed: ${err instanceof Error ? err.message : String(err)}. Falling back to rule-based 8-question generator.`,
        );
      }
    }

    return this.generateFallbackQuestions(baseline, targetRole);
  }

  private cleanJsonResponse(raw: string): string {
    let text = raw.trim();
    if (text.startsWith('```json')) {
      text = text.substring(7);
    } else if (text.startsWith('```')) {
      text = text.substring(3);
    }
    if (text.endsWith('```')) {
      text = text.substring(0, text.length - 3);
    }
    return text.trim();
  }

  /**
   * Deterministic Fallback Question Generator (8 English Questions - 2 per axis)
   */
  private generateFallbackQuestions(
    baseline: BaselineParseResult,
    targetRole: string,
  ): GeneratedQuestionsResult {
    const isFrontend =
      targetRole.includes('frontend') || targetRole.includes('react');
    const firstProject =
      baseline.key_projects_detailed_audit?.[0]?.project_name ||
      'Primary CV Project';
    const firstFeature =
      baseline.key_projects_detailed_audit?.[0]?.features_implemented?.[0]
        ?.feature_name || 'Core Module';
    const secondProject =
      baseline.key_projects_detailed_audit?.[1]?.project_name || firstProject;
    const secondFeature =
      baseline.key_projects_detailed_audit?.[1]?.features_implemented?.[0]
        ?.feature_name || firstFeature;
    const hypLevel =
      baseline.hypothesis_level_calculation?.estimated_level || 'Mid-Level';

    const questions: GeneratedQuestionItem[] = [
      // Axis 1: Technology (2 questions)
      {
        question_id: 'q_1',
        axis: 'technology',
        target_level_benchmark: 'Level 2',
        project_referenced: firstProject,
        feature_referenced: firstFeature,
        question_text: isFrontend
          ? `In the "${firstFeature}" feature of project "${firstProject}", when the application suffered from unexpected re-renders or slow data fetching, what specific memoization (useMemo, useCallback) or caching strategies (ISR/SWR) did you implement?`
          : `In the "${firstFeature}" feature of project "${firstProject}", when Redis cache timed out or database connections suffered from connection pool exhaustion, how did you resolve this runtime bottleneck?`,
        verification_goal:
          'Troubleshooting runtime bugs and technology-stack performance optimization.',
      },
      {
        question_id: 'q_2',
        axis: 'technology',
        target_level_benchmark: 'Level 2',
        project_referenced: secondProject,
        feature_referenced: secondFeature,
        question_text: isFrontend
          ? `When utilizing TypeScript and State Management (Redux/Zustand) for "${secondFeature}" in "${secondProject}", how did you design strict type safety and manage asynchronous side effects to prevent memory leaks or stale state?`
          : `When designing APIs and handling large datasets for "${secondFeature}" in "${secondProject}", how did you enforce Type Safety, validation schemas, and Async I/O to maintain clean code without resource leaks?`,
        verification_goal:
          'Evaluating depth in type safety, state management, and application resource management.',
      },

      // Axis 2: System (2 questions)
      {
        question_id: 'q_3',
        axis: 'system',
        target_level_benchmark: 'Level 2',
        project_referenced: firstProject,
        feature_referenced: firstFeature,
        question_text: `Based on the architecture of "${firstFeature}" in project "${firstProject}", if peak traffic spikes 5x suddenly, where would the primary system bottleneck occur and how would you redesign the infrastructure for scalability?`,
        verification_goal:
          'Assessing system design thinking under high load and horizontal scalability.',
      },
      {
        question_id: 'q_4',
        axis: 'system',
        target_level_benchmark: 'Level 2',
        project_referenced: secondProject,
        feature_referenced: secondFeature,
        question_text: `In project "${secondProject}", how did you structure your module directories, enforce layer separation (Presentation / Business / Data Access), and implement multi-tier caching (Client-side / CDN / Redis) for "${secondFeature}"?`,
        verification_goal:
          'Evaluating architectural ownership, data layering, and caching strategies.',
      },

      // Axis 3: People (2 questions)
      {
        question_id: 'q_5',
        axis: 'people',
        target_level_benchmark: 'Level 2',
        project_referenced: firstProject,
        feature_referenced: firstFeature,
        question_text: `During the development of "${firstFeature}" in project "${firstProject}", how did you handle technical disagreements or architectural trade-offs with teammates or product owners?`,
        verification_goal:
          'Evaluating technical communication, trade-off negotiation, and conflict resolution.',
      },
      {
        question_id: 'q_6',
        axis: 'people',
        target_level_benchmark: 'Level 2',
        project_referenced: secondProject,
        feature_referenced: secondFeature,
        question_text: `In your work on project "${secondProject}", what was your code review process? How did you provide constructive feedback or mentor team members to improve code quality?`,
        verification_goal:
          'Assessing team collaboration, code review culture, and knowledge sharing.',
      },

      // Axis 4: Process (2 questions)
      {
        question_id: 'q_7',
        axis: 'process',
        target_level_benchmark: 'Level 2',
        project_referenced: firstProject,
        feature_referenced: firstFeature,
        question_text: `For feature "${firstFeature}" in project "${firstProject}", what automated quality checks (Static Analysis, ESLint, TypeScript validation) and CI/CD deployment pipelines did you establish or follow to prevent breaking production?`,
        verification_goal:
          'Assessing understanding of automated code quality gates and CI/CD pipelines.',
      },
      {
        question_id: 'q_8',
        axis: 'process',
        target_level_benchmark: 'Level 2',
        project_referenced: secondProject,
        feature_referenced: secondFeature,
        question_text: `What automated testing strategy (Unit / Integration / E2E) and release risk management approach did you use when releasing "${secondFeature}" in "${secondProject}" to prevent downtime or data corruption?`,
        verification_goal:
          'Testing safe release strategies, automated testing, and software risk mitigation.',
      },
    ];

    return {
      total_questions: questions.length,
      target_role: targetRole,
      hypothesis_level_under_test: hypLevel,
      questions,
    };
  }
}
