import { TargetLevel, TargetRole } from '../dto/generate-roadmap-request.dto.js';

export type RoleSkillRequirement = {
  skillId: string;
  importance: number;
  targetLevel: TargetLevel;
};

export type RoleProfile = {
  displayName: string;
  domain: string;
  requiredSkills: RoleSkillRequirement[];
};

export const roleProfiles: Record<TargetRole, RoleProfile> = {
  [TargetRole.DataAnalyst]: {
    displayName: 'Data Analyst',
    domain: 'data',
    requiredSkills: [
      { skillId: 'sql', importance: 5, targetLevel: TargetLevel.Intermediate },
      { skillId: 'python', importance: 4, targetLevel: TargetLevel.Basic },
      {
        skillId: 'data_cleaning',
        importance: 5,
        targetLevel: TargetLevel.Intermediate,
      },
      {
        skillId: 'data_visualization',
        importance: 4,
        targetLevel: TargetLevel.Intermediate,
      },
    ],
  },
  [TargetRole.BackendDeveloper]: {
    displayName: 'Backend Developer',
    domain: 'software',
    requiredSkills: [
      {
        skillId: 'programming_fundamentals',
        importance: 5,
        targetLevel: TargetLevel.Intermediate,
      },
      {
        skillId: 'rest_api',
        importance: 5,
        targetLevel: TargetLevel.Intermediate,
      },
      {
        skillId: 'sql_database',
        importance: 4,
        targetLevel: TargetLevel.Intermediate,
      },
      {
        skillId: 'authentication',
        importance: 4,
        targetLevel: TargetLevel.Basic,
      },
      { skillId: 'testing', importance: 3, targetLevel: TargetLevel.Basic },
    ],
  },
  [TargetRole.AiEngineer]: {
    displayName: 'AI Engineer',
    domain: 'ai',
    requiredSkills: [
      {
        skillId: 'python',
        importance: 5,
        targetLevel: TargetLevel.Intermediate,
      },
      {
        skillId: 'data_cleaning',
        importance: 4,
        targetLevel: TargetLevel.Intermediate,
      },
      {
        skillId: 'machine_learning',
        importance: 5,
        targetLevel: TargetLevel.Intermediate,
      },
      {
        skillId: 'model_evaluation',
        importance: 4,
        targetLevel: TargetLevel.Intermediate,
      },
    ],
  },
  [TargetRole.DigitalMarketingSpecialist]: {
    displayName: 'Digital Marketing Specialist',
    domain: 'marketing',
    requiredSkills: [
      {
        skillId: 'marketing_fundamentals',
        importance: 5,
        targetLevel: TargetLevel.Basic,
      },
      {
        skillId: 'customer_research',
        importance: 4,
        targetLevel: TargetLevel.Basic,
      },
      {
        skillId: 'content_strategy',
        importance: 4,
        targetLevel: TargetLevel.Intermediate,
      },
      { skillId: 'seo', importance: 4, targetLevel: TargetLevel.Basic },
      {
        skillId: 'social_media_marketing',
        importance: 4,
        targetLevel: TargetLevel.Intermediate,
      },
      {
        skillId: 'marketing_analytics',
        importance: 4,
        targetLevel: TargetLevel.Basic,
      },
      {
        skillId: 'campaign_planning',
        importance: 5,
        targetLevel: TargetLevel.Intermediate,
      },
    ],
  },
};
