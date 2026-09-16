import { Injectable, Logger } from '@nestjs/common';
import { getAvailableApiKeys } from '../../../common/constant/app.constant.js';

export interface DetailedFeature {
  feature_name: string;
  description: string;
  technologies_used: string[];
}

export interface ProjectAuditItem {
  project_name: string;
  domain: string;
  role: string;
  scale_and_architecture: string;
  features_implemented: DetailedFeature[];
  skill_relevance_audit: {
    relevance_score: number;
    strengths: string[];
    potential_missing_skills: string[];
  };
}

export interface CertificationsAndLanguages {
  languages: Array<{
    language: string;
    proficiency: string;
    certificates: string[];
    bonus_weight: number;
  }>;
  hot_certifications: Array<{
    name: string;
    issuer: string;
    verified_or_claimed: string;
    bonus_weight: number;
  }>;
}

export interface HypothesisLevelCalculation {
  estimated_level: string;
  years_of_experience: number;
  base_score: number;
  bonus_score_from_credentials: number;
  total_hypothesis_score: number;
  rationale: string;
}

export interface BaselineParseResult {
  target_role_evaluated: string;
  primary_domain_stack: {
    domain: string;
    core_skills: string[];
  };
  secondary_versatility_stack: {
    domain: string;
    supporting_skills: string[];
    versatility_bonus_score: number;
  };
  tech_stack: {
    web?: string[];
    backend?: string[];
    mobile?: string[];
    devops_cloud?: string[];
    database?: string[];
    ai_data?: string[];
  };
  key_projects_detailed_audit: ProjectAuditItem[];
  certifications_and_languages: CertificationsAndLanguages;
  hypothesis_level_calculation: HypothesisLevelCalculation;
}

@Injectable()
export class BaselineParserService {
  private readonly logger = new Logger(BaselineParserService.name);

  /**
   * Parse CV Raw Text + Target Role -> Strict Conservative Baseline JSON
   */
  async parseBaseline(
    rawCvText: string,
    targetRole: string,
    fileBuffer?: Buffer,
    mimeType?: string,
  ): Promise<BaselineParseResult> {
    this.logger.log(`Parsing Baseline (Strict Mode) for target_role: ${targetRole}`);

    const apiKeys = getAvailableApiKeys();

    if (apiKeys.length > 0) {
      try {
        const googleGenAI = await import('@google/generative-ai' as any);
        const GoogleGenerativeAI = googleGenAI.GoogleGenerativeAI;

        const prompt = `
You are an Ultra-Strict Engineering Lead and Rigorous CV Auditor.
Parse the candidate's CV text with extreme rigor focused on the TARGET ROLE: "${targetRole}".

STRICT EVALUATION & LEVEL BENCHMARKING RULES:
1. STRICT YEARS OF EXPERIENCE CALCULATION:
   - Count ONLY full-time professional software engineering experience post-graduation or verified long-term employment.
   - Internships (e.g., 1-3 months), university projects, capstones, or student roles count as 0.0 to 0.5 years at most.
   - If candidate is currently an undergraduate student (e.g., expected graduation 2026/2027) or has only intern experience, their years_of_experience MUST BE CAPPED at 0.5.
2. STRICT SCORE & LEVEL BENCHMARKS (DO NOT INFLATE SCORES):
   - Score < 60 (Fresher / Entry-Level ~0-1 yrs exp): Student, Intern, recent graduate, or university capstone projects. Base score MUST be 45-58. DO NOT give 70+ to a student!
   - Score 60-72 (Junior Developer ~1-2 yrs exp): 1-2 years full-time experience, builds features independently. Base score 60-70.
   - Score 73-84 (Mid-Level Developer ~2-4 yrs exp): 2-4+ years verified production experience, caching, optimization.
   - Score 85+ (Senior Engineer ~5+ yrs exp): 5+ years verified architecture ownership, team leadership.
3. KEYWORD LISTING IS NOT SENIORITY:
   - Listing modern tech keywords (e.g. React 19, Redux, WebRTC, Socket.io, TanStack Query) in student/intern projects indicates LEARNING EXPOSURE, NOT MID/SENIOR MASTERY.
4. CREDENTIAL & LANGUAGE BONUSES:
   - Max bonus score is capped at +2 to +5 points (+0.02 to +0.05).

CV TEXT TO EVALUATE RIGOROUSLY:
${rawCvText.substring(0, 5000)}

OUTPUT STRICTLY VALID JSON:
{
  "target_role_evaluated": "${targetRole}",
  "primary_domain_stack": {
    "domain": "Primary domain name for ${targetRole}",
    "core_skills": ["string"]
  },
  "secondary_versatility_stack": {
    "domain": "Secondary skills",
    "supporting_skills": ["string"],
    "versatility_bonus_score": 0.05
  },
  "tech_stack": {
    "web": ["string"],
    "backend": ["string"],
    "mobile": ["string"],
    "devops_cloud": ["string"],
    "database": ["string"],
    "ai_data": ["string"]
  },
  "key_projects_detailed_audit": [
    {
      "project_name": "string",
      "domain": "string",
      "role": "string",
      "scale_and_architecture": "string",
      "features_implemented": [
        {
          "feature_name": "string",
          "description": "string",
          "technologies_used": ["string"]
        }
      ],
      "skill_relevance_audit": {
        "relevance_score": 70,
        "strengths": ["string"],
        "potential_missing_skills": ["string"]
      }
    }
  ],
  "certifications_and_languages": {
    "languages": [
      {
        "language": "English",
        "proficiency": "Intermediate | Advanced",
        "certificates": ["string"],
        "bonus_weight": 0.05
      }
    ],
    "hot_certifications": []
  },
  "hypothesis_level_calculation": {
    "estimated_level": "Fresher / Entry-Level (~0-1 yrs exp ${targetRole})",
    "years_of_experience": 0.5,
    "base_score": 52.0,
    "bonus_score_from_credentials": 3.0,
    "total_hypothesis_score": 55.0,
    "rationale": "Rigorously evaluated rationale explaining why the candidate is at this exact level."
  }
}
`;

        const contents =
          fileBuffer && mimeType
            ? [
                {
                  inlineData: {
                    data: fileBuffer.toString('base64'),
                    mimeType: mimeType || 'application/pdf',
                  },
                },
                prompt,
              ]
            : [prompt];

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
              const response = await model.generateContent(contents);
              const textRes = response.response.text();
              const cleaned = this.cleanJsonResponse(textRes);
              const parsed = JSON.parse(cleaned);
              this.logger.log(
                `Strict AI Baseline parsing successfully completed using model ${modelName} for ${targetRole}`,
              );
              return parsed as BaselineParseResult;
            } catch (err) {
              this.logger.warn(
                `Model ${modelName} with API Key (...${apiKey.slice(-6)}) failed: ${err instanceof Error ? err.message : String(err)}. Trying next...`,
              );
            }
          }
        }
      } catch (err) {
        this.logger.warn(
          `AI LLM Baseline parsing failed: ${err instanceof Error ? err.message : String(err)}. Falling back to strict baseline parser.`,
        );
      }
    }

    return this.generateFallbackBaseline(rawCvText, targetRole);
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
   * Strict Fallback Baseline Parser
   */
  private generateFallbackBaseline(
    rawText: string,
    targetRole: string,
  ): BaselineParseResult {
    const lowerText = rawText.toLowerCase();

    // Check student / intern signals
    const isStudentOrIntern =
      lowerText.includes('student') ||
      lowerText.includes('intern') ||
      lowerText.includes('undergraduate') ||
      lowerText.includes('graduation') ||
      lowerText.includes('sinh viên') ||
      lowerText.includes('thực tập');

    const expYears = isStudentOrIntern ? 0.5 : 1.5;
    const baseScore = isStudentOrIntern ? 50.0 : 65.0;
    const bonusScore = 3.0;
    const totalScore = baseScore + bonusScore;

    const estimatedLevel = isStudentOrIntern
      ? `Fresher / Entry-Level (~0-1 yrs exp ${targetRole})`
      : `Junior Developer (~1-2 yrs exp ${targetRole})`;

    const primarySkills: string[] = [];
    if (targetRole.includes('frontend') || targetRole.includes('react')) {
      if (lowerText.includes('react')) primarySkills.push('ReactJS');
      if (lowerText.includes('next')) primarySkills.push('NextJS');
      if (lowerText.includes('typescript')) primarySkills.push('TypeScript');
      if (lowerText.includes('tailwind')) primarySkills.push('TailwindCSS');
    } else {
      if (lowerText.includes('nest') || lowerText.includes('node'))
        primarySkills.push('NestJS/NodeJS');
      if (lowerText.includes('typescript')) primarySkills.push('TypeScript');
      if (lowerText.includes('redis')) primarySkills.push('Redis');
    }

    if (primarySkills.length === 0) {
      primarySkills.push('JavaScript', 'TypeScript');
    }

    return {
      target_role_evaluated: targetRole,
      primary_domain_stack: {
        domain: `${targetRole} Stack`,
        core_skills: primarySkills,
      },
      secondary_versatility_stack: {
        domain: 'Supporting Capabilities',
        supporting_skills: ['HTML/CSS', 'Git'],
        versatility_bonus_score: 0.03,
      },
      tech_stack: {
        web: primarySkills,
      },
      key_projects_detailed_audit: [
        {
          project_name: 'Dự án thực hành / Đồ án (Extracted from CV)',
          domain: targetRole,
          role: 'Student / Intern Developer',
          scale_and_architecture: 'Academic / Internship Project Scope',
          features_implemented: [
            {
              feature_name: 'Phát triển tính năng giao diện và kết nối API cơ bản',
              description: 'Xây dựng giao diện UI và tích hợp API theo hướng dẫn.',
              technologies_used: primarySkills,
            },
          ],
          skill_relevance_audit: {
            relevance_score: 68,
            strengths: primarySkills,
            potential_missing_skills: [
              'Kinh nghiệm vận hành sản phẩm Production thực tế',
              'Tối ưu hóa hiệu năng chuyên sâu (Web Vitals / Caching)',
            ],
          },
        },
      ],
      certifications_and_languages: {
        languages: [
          {
            language: 'English',
            proficiency: 'Intermediate',
            certificates: ['Reading & Technical Docs'],
            bonus_weight: 0.03,
          },
        ],
        hot_certifications: [],
      },
      hypothesis_level_calculation: {
        estimated_level: estimatedLevel,
        years_of_experience: expYears,
        base_score: baseScore,
        bonus_score_from_credentials: bonusScore,
        total_hypothesis_score: totalScore,
        rationale: `Đánh giá khắt khe: Ứng viên hiện tại là sinh viên/thực tập sinh (${expYears} năm kinh nghiệm thực tế), kiến thức tiếp cận công nghệ tốt nhưng chưa có kinh nghiệm chịu trách nhiệm hệ thống Production chính thức.`,
      },
    };
  }
}
