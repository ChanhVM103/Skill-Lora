import {
  CurrentLevel,
  GapSeverity,
  ResourceDifficulty,
} from '../dto/generate-roadmap-request.dto.js';

export const severityWeight: Record<GapSeverity, number> = {
  [GapSeverity.High]: 3,
  [GapSeverity.Medium]: 2,
  [GapSeverity.Low]: 1,
};

export const currentLevelWeight: Record<CurrentLevel, number> = {
  [CurrentLevel.Missing]: 2,
  [CurrentLevel.Partial]: 1,
  [CurrentLevel.WeakEvidence]: 1,
};

export const difficultyByCurrentLevel: Record<CurrentLevel, ResourceDifficulty> = {
  [CurrentLevel.Missing]: ResourceDifficulty.Beginner,
  [CurrentLevel.Partial]: ResourceDifficulty.Intermediate,
  [CurrentLevel.WeakEvidence]: ResourceDifficulty.Beginner,
};
