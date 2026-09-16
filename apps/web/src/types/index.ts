export type PatternTheme =
  | 'purple-mesh'
  | 'orange-waves'
  | 'slate-poly'
  | 'teal-geometric'
  | 'blue-statue'
  | 'pink-mosaic'
  | 'green-abstract'
  | 'yellow-mesh';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  quizQuestion?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

export interface Course {
  id: string;
  code: string;
  title: string;
  instructor: string;
  progress: number;
  patternTheme: PatternTheme;
  category: string;
  level: 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  description: string;
  lessonsCount: number;
  completedLessons: number;
  skillsTaught: string[];
  lessons: Lesson[];
  isRecommendedFromCv?: boolean;
}

export interface RadarMetric {
  subject: string;
  score: number;
  fullMark: number;
}

export interface CvAnalysis {
  analysisId?: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  matchScore: number;
  targetRole: string;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  suggestedCourseIds: string[];
  radarScores: RadarMetric[];
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  category: string;
}

export interface RoadmapItem {
  id: string;
  week: number;
  title: string;
  description: string;
  courseId?: string;
  completed: boolean;
  estimatedHours: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface UserProfile {
  name: string;
  studentId: string;
  faculty: string;
  careerGoal: string;
  avatar: string;
  role?: 'student' | 'teacher' | 'admin' | string;
  email?: string;
}

export type ActivityType = 'cv_scan' | 'lesson_complete' | 'quiz_attempt' | 'assessment_submit' | 'page_visit';

export interface ActivityLogItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    analysisId?: string;
    score?: number;
    targetRole?: string;
    courseId?: string;
    courseTitle?: string;
    lessonTitle?: string;
    fileName?: string;
    tabName?: string;
  };
}

export type MainTabType = 'courses' | 'cv-scanner' | 'assessment' | 'roadmap' | 'history' | 'admin' | 'login';

