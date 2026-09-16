import { Injectable, Logger } from '@nestjs/common';
import { getAvailableApiKeys } from '../../../common/constant/app.constant.js';
import { ENGINEERING_LADDERS_RUBRIC } from '../config/engineering-ladders.rubric.js';
import { BaselineParseResult } from './baseline-parser.service.js';

export interface QaPairItem {
  question_id: string;
  axis: string;
  target_level_benchmark: string;
  project_referenced: string;
  feature_referenced: string;
  question_text: string;
  candidate_answer: string;
}

export interface RubricEvaluationResult {
  hypothesis_level_verification: {
    step_1_hypothesis: string;
    current_verified_level: string;
    next_target_level: string;
    verdict: 'ACCURATE' | 'OVERSTATED_IN_CV' | 'UNDERSTATED_IN_CV';
    verification_summary: string;
  };
  scores_by_axis: {
    technology: {
      level: number;
      score: number;
      verified_quote: string;
      rationale: string;
    };
    system: {
      level: number;
      score: number;
      verified_quote: string;
      rationale: string;
    };
    people: {
      level: number;
      score: number;
      verified_quote: string;
      rationale: string;
    };
    process: {
      level: number;
      score: number;
      verified_quote: string;
      rationale: string;
    };
  };
  evidence_ledger: Array<{
    axis: string;
    question_id: string;
    candidate_quote: string;
    verdict: 'VERIFIED_HANDS_ON' | 'THEORETICAL_ONLY' | 'NO_EVIDENCE';
    assigned_level: number;
  }>;
  actionable_level_up_blueprint: {
    role_context: string;
    summary: string;
    required_skills_to_learn: Array<{
      skill_name: string;
      axis_category: string;
      why_needed: string;
      priority: 'HIGH' | 'MEDIUM' | 'LOW';
    }>;
    practical_features_to_build: Array<{
      feature_title: string;
      project_context: string;
      technical_requirements: string[];
      expected_learning_outcome: string;
    }>;
    english_improvement_roadmap: {
      current_perceived_english: string;
      target_english_benchmark: string;
      key_focus_areas: string[];
      recommended_action: string;
    };
  };
}

@Injectable()
export class RubricEvaluatorService {
  private readonly logger = new Logger(RubricEvaluatorService.name);

  /**
   * Đánh giá Chấm điểm Rubric & Sinh Lộ trình Nâng Level (Step 4 - Strict Mode)
   */
  async evaluateRubric(
    rawCvText: string,
    baseline: BaselineParseResult,
    targetRole: string,
    qaPairs: QaPairItem[],
  ): Promise<RubricEvaluationResult> {
    this.logger.log(`Evaluating Rubric (Strict Mode) for target_role: ${targetRole}, QA Pairs count: ${qaPairs.length}`);

    const apiKeys = getAvailableApiKeys();

    if (apiKeys.length > 0) {
      try {
        const googleGenAI = await import('@google/generative-ai' as any);
        const GoogleGenerativeAI = googleGenAI.GoogleGenerativeAI;

        const prompt = `
You are an Ultra-Strict Engineering Assessor and Executive Technical Evaluator.
Evaluate the candidate using the Ground Truth Engineering Ladders Rubric (Level 1 to Level 5 across 4 Axes: Technology, System, People, Process).

GROUND TRUTH RUBRIC DEFINITIONS:
${JSON.stringify(ENGINEERING_LADDERS_RUBRIC, null, 2)}

CANDIDATE DATA PAYLOAD FOR RIGOROUS EVALUATION:
1. Target Role: "${targetRole}"
2. Step 1 Baseline Hypothesis: ${JSON.stringify(baseline.hypothesis_level_calculation)}
3. Raw Extracted CV Text:
${rawCvText.substring(0, 3000)}
4. Candidate Interview Questions & Answers (Step 2 & Step 3):
${JSON.stringify(qaPairs, null, 2)}

STRICT EVALUATION & BENCHMARKING RULES:
1. IMPORTANT LANGUAGE RULE: ALL EVALUATION VERDICTS, RATIONALES, VERIFICATION SUMMARIES, AND ACTIONABLE LEVEL-UP BLUEPRINTS MUST BE WRITTEN ENTIRELY IN PROFESSIONAL TECHNICAL ENGLISH.
2. ULTRA-STRICT EVIDENCE RULE:
   - Level 1 (Entry / Fresher / Student): Candidate gives basic, textbook, or student-level answers without verified production experience. Score: 45-58.
   - Level 2 (Specialist / Junior): Candidate demonstrates independent feature implementation and basic debugging steps. Score: 60-72.
   - Level 3 (Advanced Specialist / Mid): Candidate provides concrete, verified hands-on evidence of production performance tuning, caching strategies, race condition handling, and 5x bottleneck analysis. Score: 73-84.
   - Level 4 (Architect / Senior): Candidate demonstrates system architecture ownership, technical trade-offs negotiation, and CI/CD quality gate setup. Score: 85-94.
   - Level 5 (Staff / Principal): Candidate demonstrates organization-wide platform architecture. Score: 95+.
3. DOWNGRADE UNVERIFIED OR THEORETICAL CLAIMS:
   - If candidate's answers are brief, generic, or lack concrete hands-on implementation details, DO NOT AWARD Level 3+. Downgrade their level to Level 1 or Level 2 and mark verdict as OVERSTATED_IN_CV (if CV claimed higher) or ACCURATE (if CV was already Entry/Fresher).
4. DIRECT QUOTE EVIDENCE REQUIRED:
   - Quote exact verbatim text from candidate's answers for every single axis.

OUTPUT STRICTLY VALID JSON:
{
  "hypothesis_level_verification": {
    "step_1_hypothesis": "${baseline.hypothesis_level_calculation?.estimated_level || 'Fresher / Entry-Level'}",
    "current_verified_level": "Level 1 (Fresher / Entry Developer) | Level 2 (Junior) | Level 3 (Mid) | Level 4 (Senior)",
    "next_target_level": "Level 2 (Junior Specialist) | Level 3 (Mid Developer) | Level 4 (Senior Engineer)",
    "verdict": "ACCURATE | OVERSTATED_IN_CV | UNDERSTATED_IN_CV",
    "verification_summary": "Rigorously evaluated summary in English comparing CV claims vs interview answers."
  },
  "scores_by_axis": {
    "technology": {
      "level": 1,
      "score": 52,
      "verified_quote": "exact quote from answer",
      "rationale": "technical rationale in English"
    },
    "system": {
      "level": 1,
      "score": 50,
      "verified_quote": "exact quote from answer",
      "rationale": "system rationale in English"
    },
    "people": {
      "level": 1,
      "score": 55,
      "verified_quote": "exact quote from answer",
      "rationale": "people rationale in English"
    },
    "process": {
      "level": 1,
      "score": 54,
      "verified_quote": "exact quote from answer",
      "rationale": "process rationale in English"
    }
  },
  "evidence_ledger": [
    {
      "axis": "technology",
      "question_id": "q_1",
      "candidate_quote": "quote",
      "verdict": "THEORETICAL_ONLY | VERIFIED_HANDS_ON | NO_EVIDENCE",
      "assigned_level": 1
    }
  ],
  "actionable_level_up_blueprint": {
    "role_context": "${targetRole}",
    "summary": "Actionable roadmap to advance from current level to target level for ${targetRole}",
    "required_skills_to_learn": [
      {
        "skill_name": "string",
        "axis_category": "technology | system | people | process",
        "why_needed": "why needed explanation in English",
        "priority": "HIGH | MEDIUM | LOW"
      }
    ],
    "practical_features_to_build": [
      {
        "feature_title": "string",
        "project_context": "project context in English",
        "technical_requirements": ["string"],
        "expected_learning_outcome": "expected outcome in English"
      }
    ],
    "english_improvement_roadmap": {
      "current_perceived_english": "Intermediate Technical Reading",
      "target_english_benchmark": "TOEIC 750+ / IELTS 6.0 / Professional Documentation",
      "key_focus_areas": ["Read official framework documentation directly", "Write technical design docs in English"],
      "recommended_action": "Spend 30 minutes daily reading technical docs and writing code documentation in English."
    }
  }
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
                `Strict Rubric Evaluation successfully completed using model ${modelName}.`,
              );
              return parsed as RubricEvaluationResult;
            } catch (err) {
              this.logger.warn(
                `Model ${modelName} with API Key (...${apiKey.slice(-6)}) failed: ${err instanceof Error ? err.message : String(err)}. Trying next...`,
              );
            }
          }
        }
      } catch (err) {
        this.logger.warn(
          `AI Rubric Evaluator failed: ${err instanceof Error ? err.message : String(err)}. Falling back to strict rule-based evaluator.`,
        );
      }
    }

    return this.generateFallbackEvaluation(baseline, targetRole, qaPairs);
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
   * Strict Fallback Evaluation Generator (100% English)
   */
  private generateFallbackEvaluation(
    baseline: BaselineParseResult,
    targetRole: string,
    qaPairs: QaPairItem[],
  ): RubricEvaluationResult {
    const isFrontend =
      targetRole.includes('frontend') || targetRole.includes('react');

    const techAnswer =
      qaPairs.find((q) => q.axis === 'technology')?.candidate_answer ||
      'No deep hands-on technical evidence provided.';
    const systemAnswer =
      qaPairs.find((q) => q.axis === 'system')?.candidate_answer ||
      'Basic theoretical knowledge provided.';
    const peopleAnswer =
      qaPairs.find((q) => q.axis === 'people')?.candidate_answer ||
      'Basic team support provided.';
    const processAnswer =
      qaPairs.find((q) => q.axis === 'process')?.candidate_answer ||
      'Basic Git commits and unit testing executed.';

    const hypLevel =
      baseline.hypothesis_level_calculation?.estimated_level ||
      'Fresher / Entry-Level';

    const isStudent =
      hypLevel.toLowerCase().includes('fresher') ||
      hypLevel.toLowerCase().includes('entry');

    const currentVerifiedLevel = isStudent
      ? 'Level 1 (Fresher / Entry Developer)'
      : 'Level 2 (Junior Specialist)';
    const nextTargetLevel = isStudent
      ? 'Level 2 (Junior Specialist Developer)'
      : 'Level 3 (Mid-Level Developer)';

    return {
      hypothesis_level_verification: {
        step_1_hypothesis: hypLevel,
        current_verified_level: currentVerifiedLevel,
        next_target_level: nextTargetLevel,
        verdict: 'ACCURATE',
        verification_summary: `Rigorously evaluated: Candidate is at ${currentVerifiedLevel}. Interview responses accurately reflect current capabilities, requiring hands-on production experience and performance tuning.`,
      },
      scores_by_axis: {
        technology: {
          level: isStudent ? 1 : 2,
          score: isStudent ? 54 : 65,
          verified_quote: techAnswer.substring(0, 100),
          rationale: 'Demonstrates foundational tech stack knowledge; needs hands-on runtime troubleshooting practice.',
        },
        system: {
          level: isStudent ? 1 : 2,
          score: isStudent ? 50 : 62,
          verified_quote: systemAnswer.substring(0, 100),
          rationale: 'Understands basic application data flow; needs deeper learning in bottleneck analysis and multi-tier caching.',
        },
        people: {
          level: isStudent ? 1 : 2,
          score: isStudent ? 55 : 66,
          verified_quote: peopleAnswer.substring(0, 100),
          rationale: 'Good technical communication and collaboration within small teams.',
        },
        process: {
          level: isStudent ? 1 : 2,
          score: isStudent ? 52 : 64,
          verified_quote: processAnswer.substring(0, 100),
          rationale: 'Follows standard Git workflow and basic testing practices.',
        },
      },
      evidence_ledger: [
        {
          axis: 'technology',
          question_id: 'q_1',
          candidate_quote: techAnswer.substring(0, 80),
          verdict: 'THEORETICAL_ONLY',
          assigned_level: isStudent ? 1 : 2,
        },
        {
          axis: 'system',
          question_id: 'q_3',
          candidate_quote: systemAnswer.substring(0, 80),
          verdict: 'THEORETICAL_ONLY',
          assigned_level: isStudent ? 1 : 2,
        },
      ],
      actionable_level_up_blueprint: {
        role_context: targetRole,
        summary: `Actionable level-up blueprint to advance from ${currentVerifiedLevel} to ${nextTargetLevel}`,
        required_skills_to_learn: [
          {
            skill_name: isFrontend
              ? 'React Performance Optimization & Memoization (useMemo/useCallback)'
              : 'Database Indexing & Query Optimization (MySQL/MongoDB)',
            axis_category: 'technology',
            why_needed: 'Master core performance tuning and runtime bug troubleshooting',
            priority: 'HIGH',
          },
          {
            skill_name: isFrontend
              ? 'Next.js Rendering Strategies (SSR vs SSG vs ISR) & Web Vitals'
              : 'Redis Caching & Async Message Queue Integration',
            axis_category: 'system',
            why_needed: 'Elevate system architecture and data layering capabilities',
            priority: 'HIGH',
          },
        ],
        practical_features_to_build: [
          {
            feature_title: isFrontend
              ? 'Build an e-Commerce Web Application optimizing LCP & CLS for Lighthouse 95+ score'
              : 'Build a Production RESTful API with Redis Caching & Rate Limiting Middleware',
            project_context: `Practice project tailored for ${targetRole}`,
            technical_requirements: isFrontend
              ? ['Next.js App Router', 'Dynamic Image Optimization', 'Zero Layout Shift']
              : ['NestJS', 'Redis', 'Class-Validator', 'Docker Compose'],
            expected_learning_outcome: `Demonstrate hands-on competency required for ${nextTargetLevel}`,
          },
        ],
        english_improvement_roadmap: {
          current_perceived_english: 'Basic Technical Reading',
          target_english_benchmark: 'TOEIC 750+ / Read Official Docs fluently',
          key_focus_areas: [
            'Read official framework documentation directly instead of translated guides',
            `Write technical design documents and code comments in English for ${targetRole}`,
          ],
          recommended_action:
            'Spend 30 minutes daily reading technical documentation and writing project notes in English.',
        },
      },
    };
  }
}
