import { GapCategory } from '../dto/generate-roadmap-request.dto.js';

export type SkillDefinition = {
  id: string;
  name: string;
  domain: string;
  category: 'technical' | 'soft_skill' | 'general';
  defaultPhase: GapCategory;
  prerequisites: string[];
};

export const skillTaxonomy: Record<string, SkillDefinition> = {
  programming_fundamentals: {
    id: 'programming_fundamentals',
    name: 'Programming Fundamentals',
    domain: 'software',
    category: 'technical',
    defaultPhase: GapCategory.Foundation,
    prerequisites: [],
  },
  rest_api: {
    id: 'rest_api',
    name: 'REST API',
    domain: 'software',
    category: 'technical',
    defaultPhase: GapCategory.Core,
    prerequisites: ['programming_fundamentals', 'http_basics'],
  },
  sql_database: {
    id: 'sql_database',
    name: 'SQL Database',
    domain: 'software',
    category: 'technical',
    defaultPhase: GapCategory.Core,
    prerequisites: ['programming_fundamentals'],
  },
  authentication: {
    id: 'authentication',
    name: 'Authentication',
    domain: 'software',
    category: 'technical',
    defaultPhase: GapCategory.Core,
    prerequisites: ['rest_api'],
  },
  testing: {
    id: 'testing',
    name: 'Testing',
    domain: 'software',
    category: 'technical',
    defaultPhase: GapCategory.Portfolio,
    prerequisites: ['programming_fundamentals'],
  },
  sql: {
    id: 'sql',
    name: 'SQL',
    domain: 'data',
    category: 'technical',
    defaultPhase: GapCategory.Foundation,
    prerequisites: [],
  },
  python: {
    id: 'python',
    name: 'Python',
    domain: 'data',
    category: 'technical',
    defaultPhase: GapCategory.Foundation,
    prerequisites: [],
  },
  data_cleaning: {
    id: 'data_cleaning',
    name: 'Data Cleaning',
    domain: 'data',
    category: 'technical',
    defaultPhase: GapCategory.Core,
    prerequisites: ['python', 'sql'],
  },
  data_visualization: {
    id: 'data_visualization',
    name: 'Data Visualization',
    domain: 'data',
    category: 'technical',
    defaultPhase: GapCategory.Core,
    prerequisites: ['data_cleaning'],
  },
  machine_learning: {
    id: 'machine_learning',
    name: 'Machine Learning',
    domain: 'ai',
    category: 'technical',
    defaultPhase: GapCategory.Core,
    prerequisites: ['python', 'data_cleaning'],
  },
  model_evaluation: {
    id: 'model_evaluation',
    name: 'Model Evaluation',
    domain: 'ai',
    category: 'technical',
    defaultPhase: GapCategory.Core,
    prerequisites: ['machine_learning'],
  },
  marketing_fundamentals: {
    id: 'marketing_fundamentals',
    name: 'Marketing Fundamentals',
    domain: 'marketing',
    category: 'technical',
    defaultPhase: GapCategory.Foundation,
    prerequisites: [],
  },
  customer_research: {
    id: 'customer_research',
    name: 'Customer Research',
    domain: 'marketing',
    category: 'technical',
    defaultPhase: GapCategory.Foundation,
    prerequisites: ['marketing_fundamentals'],
  },
  content_strategy: {
    id: 'content_strategy',
    name: 'Content Strategy',
    domain: 'marketing',
    category: 'technical',
    defaultPhase: GapCategory.Core,
    prerequisites: ['customer_research'],
  },
  seo: {
    id: 'seo',
    name: 'SEO',
    domain: 'marketing',
    category: 'technical',
    defaultPhase: GapCategory.Core,
    prerequisites: ['marketing_fundamentals'],
  },
  social_media_marketing: {
    id: 'social_media_marketing',
    name: 'Social Media Marketing',
    domain: 'marketing',
    category: 'technical',
    defaultPhase: GapCategory.Core,
    prerequisites: ['content_strategy'],
  },
  marketing_analytics: {
    id: 'marketing_analytics',
    name: 'Marketing Analytics',
    domain: 'marketing',
    category: 'technical',
    defaultPhase: GapCategory.Core,
    prerequisites: ['marketing_fundamentals'],
  },
  campaign_planning: {
    id: 'campaign_planning',
    name: 'Campaign Planning',
    domain: 'marketing',
    category: 'technical',
    defaultPhase: GapCategory.AppliedProject,
    prerequisites: ['customer_research', 'content_strategy'],
  },
};
