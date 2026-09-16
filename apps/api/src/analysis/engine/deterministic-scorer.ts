export interface ScorerInput {
  matchedCoreCount: number;
  totalCoreCount: number;
  foundAtsCount: number;
  totalAtsCount: number;
  hasTranscript: boolean;
}

export interface ComputedScores {
  readiness_score: number;
  ats_score: number;
  academic_score: number;
  match_percentage: number;
  level_tier: 'Beginner' | 'Foundational' | 'Competent' | 'Role Ready';
}

export class DeterministicScorer {
  static compute(input: ScorerInput): ComputedScores {
    const {
      matchedCoreCount,
      totalCoreCount,
      foundAtsCount,
      totalAtsCount,
      hasTranscript,
    } = input;

    // 1. Match Percentage
    const match_percentage =
      totalCoreCount > 0
        ? Math.round((matchedCoreCount / totalCoreCount) * 100)
        : 0;

    // 2. ATS Score (Keyword density + baseline format score)
    const atsKeywordRatio =
      totalAtsCount > 0 ? foundAtsCount / totalAtsCount : 0.5;
    const ats_score = Math.min(
      100,
      Math.max(40, Math.round(50 + atsKeywordRatio * 50)),
    );

    // 3. Academic Score
    const academic_score = hasTranscript ? 78 : 70;

    // 4. Overall Readiness Score (Weighted: 55% Core Skills + 25% ATS + 20% Academic)
    const rawReadiness =
      match_percentage * 0.55 + ats_score * 0.25 + academic_score * 0.2;
    const readiness_score = Math.min(100, Math.max(10, Math.round(rawReadiness)));

    // 5. Level Tier
    let level_tier: 'Beginner' | 'Foundational' | 'Competent' | 'Role Ready' =
      'Beginner';
    if (readiness_score >= 82) {
      level_tier = 'Role Ready';
    } else if (readiness_score >= 68) {
      level_tier = 'Competent';
    } else if (readiness_score >= 48) {
      level_tier = 'Foundational';
    }

    return {
      readiness_score,
      ats_score,
      academic_score,
      match_percentage,
      level_tier,
    };
  }
}
