export type Difficulty = 'easy' | 'medium' | 'hard';
export type Priority = 'high' | 'normal' | 'low';

// 3 Core Study Phases as required: Learning, Review, Practice
export type StudyPhase = 'learning' | 'review' | 'practice';

export type ActivityType =
  | 'learning'
  | 'read'
  | 'review'
  | 'practice'
  | 'summary'
  | 'mock_exam'
  | 'rest';

export type ViewTab = 'landing' | 'subjects' | 'availability' | 'dashboard' | 'daily' | 'calendar';

export interface Subject {
  id: string;
  name: string;
  examDate: string; // YYYY-MM-DD
  difficulty: Difficulty;
  understandingLevel: number; // 1 (เข้าใจน้อยมาก) ถึง 5 (เข้าใจดีมาก)
  topics?: string;
  targetGrade?: string;
  priority?: Priority;
  color?: string;
}

export interface DayAvailability {
  weekdayHours: number; // วันจันทร์ - ศุกร์ (ชม./วัน)
  weekendHours: number; // วันเสาร์ - อาทิตย์ (ชม./วัน)
  defaultHours: number;
  customDailyHours: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
  preferredTimes: string[];
}

export interface StudySession {
  id: string;
  subjectName: string;
  topic: string;
  phase: StudyPhase; // 'learning' | 'review' | 'practice'
  activityType: ActivityType;
  durationMinutes: number; // 50 นาที
  breakMinutes?: number; // 10 นาที
  recommendedTechnique: string;
  tips?: string;
  completed?: boolean;
}

export interface StudyDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  focusSummary: string;
  targetHours: number;
  sessions: StudySession[];
}

export interface SubjectSummary {
  subjectName: string;
  allocatedHours: number;
  advice: string;
  priorityScore?: number;
  reason?: string;
}

export interface PriorityRanking {
  subjectName: string;
  priorityScore: number; // 1-100
  urgency: 'high' | 'medium' | 'low';
  reason: string;
}

export interface PhaseBreakdown {
  learningHours: number;
  reviewHours: number;
  practiceHours: number;
}

export interface StudyPlan {
  planTitle: string;
  summary: string;
  totalStudyHours: number;
  examStrategies: string[];
  subjectSummaries: SubjectSummary[];
  priorityRankings?: PriorityRanking[];
  phaseBreakdown?: PhaseBreakdown;
  days: StudyDay[];
  createdAt: string;
}
