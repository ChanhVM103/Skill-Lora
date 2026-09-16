import type { RoadmapGapItem, TargetRole } from './roadmap.types';


export interface ParsedCv {
  candidate_name?: string;
  email?: string;
  phone?: string;
  education?: string;
  skills: string[];
  experience_summary?: string;
}

export interface CourseGrade {
  course_name: string;
  grade: string;
  credits?: number;
  relevant_to_role?: boolean;
}

export interface ParsedTranscript {
  institution?: string;
  major?: string;
  gpa?: number;
  courses: CourseGrade[];
}

export interface AnalysisScores {
  readiness_score: number; // 0 - 100
  ats_score: number;       // 0 - 100
  academic_score: number;  // 0 - 100
  match_percentage: number;// 0 - 100
  level_tier: 'Beginner' | 'Foundational' | 'Competent' | 'Role Ready';
}

export interface AtsCheck {
  id: string;
  check_name: string;
  status: 'passed' | 'warning' | 'failed';
  message: string;
}

export interface AcademicCheck {
  id: string;
  subject: string;
  status: 'strong' | 'acceptable' | 'gap';
  feedback: string;
}

export interface PrioritizedAction {
  id: string;
  order: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface AnalysisResponse {
  analysis_id: string;
  created_at: string;
  target_role: TargetRole;
  custom_jd?: string;
  parsed_cv: ParsedCv;
  parsed_transcript?: ParsedTranscript;
  scores: AnalysisScores;
  ats_checks: AtsCheck[];
  academic_checks: AcademicCheck[];
  existing_skills: string[];
  missing_skills: string[];
  gap_items: RoadmapGapItem[];
  prioritized_actions: PrioritizedAction[];
}
