export interface LandingCourse {
  id: string;
  title: string;
  category: string;
  mentor: string;
  mentorTitle: string;
  duration: string;
  level: 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  description: string;
  highlightTag: string;
  practicalProject: string;
  skills: string[];
}

export interface StudentFeedback {
  id: string;
  name: string;
  faculty: string;
  university: string;
  roleWon: string;
  company: string;
  quote: string;
  rating: number;
  avatar: string;
  cvScoreBefore: number;
  cvScoreAfter: number;
}

export interface JourneyStep {
  step: number;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  actionHint: string;
}

export interface MissingCvItem {
  id: string;
  title: string;
  issue: string;
  solution: string;
  priority: 'Cao' | 'Trung bình';
  impactPercentage: number;
}

export interface LandingCvMockResult {
  fileName: string;
  fileSize: string;
  matchScore: number;
  targetRole: string;
  analyzedDate: string;
  summary: string;
  missingItems: MissingCvItem[];
  suggestedCourseIds: string[];
}
