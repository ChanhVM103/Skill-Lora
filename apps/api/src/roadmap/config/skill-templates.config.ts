export type SkillTemplate = {
  theory: string;
  practice: string;
  assessment: string;
  deliverable: string;
};

export const genericSkillTemplate: SkillTemplate = {
  theory: 'Learn the core concepts and vocabulary for this skill',
  practice: 'Complete a focused practice task using this skill',
  assessment: 'Explain the decisions, tradeoffs, and result of the practice task',
  deliverable: 'Short learning note and practical artifact showing the skill',
};

export const skillTemplates: Record<string, SkillTemplate> = {
  programming_fundamentals: {
    theory: 'Learn variables, control flow, functions, data structures, and debugging basics',
    practice: 'Solve small programming exercises with arrays, objects, and functions',
    assessment: 'Explain how the solution works and how edge cases are handled',
    deliverable: 'Repository with solved exercises and short notes',
  },
  rest_api: {
    theory: 'Learn HTTP methods, REST conventions, status codes, and request validation',
    practice: 'Build CRUD endpoints for a task management API',
    assessment: 'Explain endpoint design, validation, and error handling',
    deliverable: 'GitHub repository with API routes, README, and sample requests',
  },
  sql_database: {
    theory: 'Learn relational tables, keys, SELECT, JOIN, filtering, and aggregation',
    practice: 'Design a small schema and write queries for a backend feature',
    assessment: 'Explain table relationships and query choices',
    deliverable: 'SQL schema, sample queries, and notes',
  },
  authentication: {
    theory: 'Learn sessions, tokens, password hashing, and protected routes',
    practice: 'Add signup, login, and protected endpoints to an API',
    assessment: 'Explain authentication flow and security risks',
    deliverable: 'API repository with authentication endpoints documented',
  },
  testing: {
    theory: 'Learn unit tests, integration tests, test cases, and assertions',
    practice: 'Write tests for important API service and controller behavior',
    assessment: 'Explain which risks the tests cover',
    deliverable: 'Test suite committed with a coverage summary',
  },
  sql: {
    theory: 'Learn SELECT, WHERE, JOIN, GROUP BY, aggregation, and filtering',
    practice: 'Analyze a small dataset with SQL queries',
    assessment: 'Explain query logic and summarize findings',
    deliverable: 'SQL file with queries and short explanations',
  },
  python: {
    theory: 'Learn Python variables, functions, collections, files, and notebooks',
    practice: 'Clean and summarize a small CSV dataset with Python',
    assessment: 'Explain the data transformations and summary results',
    deliverable: 'Notebook or script with comments and output summary',
  },
  data_cleaning: {
    theory: 'Learn missing values, data types, duplicates, outliers, and normalization',
    practice: 'Clean a messy dataset and document each transformation',
    assessment: 'Explain why each cleaning decision was made',
    deliverable: 'Cleaned dataset and transformation log',
  },
  data_visualization: {
    theory: 'Learn chart selection, axes, labels, color use, and storytelling basics',
    practice: 'Create charts that answer business questions from a dataset',
    assessment: 'Explain what each chart communicates',
    deliverable: 'Dashboard or chart report with written insights',
  },
  machine_learning: {
    theory: 'Learn supervised learning, features, labels, train/test split, and basic models',
    practice: 'Train a baseline model on a small dataset',
    assessment: 'Explain model choice, features, and limitations',
    deliverable: 'Notebook with baseline model and documented results',
  },
  model_evaluation: {
    theory: 'Learn accuracy, precision, recall, F1 score, confusion matrix, and validation',
    practice: 'Evaluate a model and compare metrics across candidate approaches',
    assessment: 'Explain which metric best fits the problem',
    deliverable: 'Evaluation report with metrics and interpretation',
  },
  marketing_fundamentals: {
    theory: 'Learn market, customer segment, value proposition, funnel, and positioning basics',
    practice: 'Describe a sample product target audience and value proposition',
    assessment: 'Explain the customer problem and positioning choice',
    deliverable: 'One-page marketing foundation brief',
  },
  customer_research: {
    theory: 'Learn personas, customer interviews, pain points, and survey basics',
    practice: 'Create a persona and research plan for a sample product',
    assessment: 'Explain assumptions and what evidence is still needed',
    deliverable: 'Persona and customer research plan',
  },
  content_strategy: {
    theory: 'Learn content pillars, audience intent, channels, and editorial planning',
    practice: 'Create a two-week content calendar for a campaign',
    assessment: 'Explain how each content idea maps to the audience and funnel',
    deliverable: 'Content calendar with post ideas and rationale',
  },
  seo: {
    theory: 'Learn keyword research, search intent, on-page SEO, and basic technical SEO',
    practice: 'Create an SEO plan for a blog article or landing page',
    assessment: 'Explain keyword choice, search intent, and optimization decisions',
    deliverable: 'SEO brief with target keywords, outline, title, meta description, and internal links',
  },
  social_media_marketing: {
    theory: 'Learn channel fit, posting formats, engagement signals, and community basics',
    practice: 'Draft a set of social posts for one campaign objective',
    assessment: 'Explain channel choice and expected user action',
    deliverable: 'Social media post set with captions and creative notes',
  },
  marketing_analytics: {
    theory: 'Learn impressions, clicks, conversion rate, CAC, engagement rate, and campaign KPIs',
    practice: 'Analyze a small campaign metrics table',
    assessment: 'Explain what worked, what did not, and what to change next',
    deliverable: 'KPI report with recommendations',
  },
  campaign_planning: {
    theory: 'Learn campaign objective, audience, channels, budget, timeline, and KPI planning',
    practice: 'Plan a campaign for a sample product or school project',
    assessment: 'Explain the campaign strategy and measurement plan',
    deliverable: 'Campaign proposal and portfolio case study outline',
  },
};
