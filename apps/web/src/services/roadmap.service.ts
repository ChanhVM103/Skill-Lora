import { apiClient } from './api-client';
import type {
  GenerateRoadmapRequest,
  RoadmapGapItem,
  RoadmapResponse,
  TargetRole,
} from '../types/roadmap.types';


export const roadmapService = {
  /**
   * Calls POST /api/roadmaps/generate
   */
  async generateRoadmap(payload: GenerateRoadmapRequest): Promise<RoadmapResponse> {
    const response = await apiClient.post<RoadmapResponse>('/roadmaps/generate', payload);
    return response.data;
  },

  /**
   * Sample gap items for instant testing & demonstration
   */
  getDefaultGapItems(role: TargetRole): RoadmapGapItem[] {
    switch (role) {
      case 'data_analyst':
        return [
          {
            skill_id: 'sql_advanced',
            skill_name: 'SQL Advanced (Window functions, CTE)',
            category: 'core',
            severity: 'high',
            current_level: 'missing',
            target_level: 'intermediate',
            reason: 'CV lacks complex analytical SQL queries.',
          },
          {
            skill_id: 'power_bi',
            skill_name: 'Power BI / Tableau Dashboarding',
            category: 'applied_project',
            severity: 'medium',
            current_level: 'partial',
            target_level: 'intermediate',
            reason: 'Basic dashboard mentioned, no interactive KPI report.',
          },
          {
            skill_id: 'python_pandas',
            skill_name: 'Python for Data Analysis (Pandas, NumPy)',
            category: 'core',
            severity: 'high',
            current_level: 'missing',
            target_level: 'intermediate',
            reason: 'Data manipulation in Python is a prerequisite.',
          },
        ];

      case 'ai_engineer':
        return [
          {
            skill_id: 'deep_learning',
            skill_name: 'PyTorch / Neural Networks',
            category: 'core',
            severity: 'high',
            current_level: 'missing',
            target_level: 'intermediate',
            reason: 'No evidence of PyTorch model training.',
          },
          {
            skill_id: 'llm_finetuning',
            skill_name: 'LLM Prompt Engineering & RAG',
            category: 'applied_project',
            severity: 'high',
            current_level: 'missing',
            target_level: 'advanced',
            reason: 'Modern AI role requires RAG or fine-tuning experience.',
          },
          {
            skill_id: 'model_deployment',
            skill_name: 'Model Serving & FastAPI',
            category: 'portfolio',
            severity: 'medium',
            current_level: 'partial',
            target_level: 'intermediate',
            reason: 'Model serving API is required for production readiness.',
          },
        ];

      case 'backend_developer':
      default:
        return [
          {
            skill_id: 'rest_api',
            skill_name: 'RESTful API & Validation',
            category: 'core',
            severity: 'high',
            current_level: 'missing',
            target_level: 'intermediate',
            reason: 'No REST API project evidence found in CV.',
          },
          {
            skill_id: 'sql_orm',
            skill_name: 'Database Design & Prisma/TypeORM',
            category: 'core',
            severity: 'high',
            current_level: 'partial',
            target_level: 'intermediate',
            reason: 'Basic SQL known, needs hands-on relational schema & migrations.',
          },
          {
            skill_id: 'docker',
            skill_name: 'Docker & Containerization',
            category: 'applied_project',
            severity: 'medium',
            current_level: 'missing',
            target_level: 'intermediate',
            reason: 'Containerization is essential for backend deployment.',
          },
        ];
    }
  },
};
