
export type ViewState = 'auth' | 'dashboard' | 'tracker' | 'new-session' | 'active-session' | 'history' | 'session-details' | 'profile-wizard' | 'chat' | 'profile';

export enum SessionType {
  STRENGTH = 'Strength',
  MOBILITY = 'Mobility',
  PERFORMANCE = 'Performance',
  CIRCUIT = 'Circuit',
  CUSTOM = 'Custom'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface SetData {
  id: string;
  reps: number;
  weight: number | null;
  time: number | null;
  completed: boolean;
}

export interface ExerciseData {
  id: string;
  name: string;
  sets: SetData[];
  isTimed: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  targetReps?: string; // From AI plan
  targetSets?: number; // From AI plan
  notes?: string;
}

export interface Session {
  id: string;
  date: string;
  type: SessionType | string;
  durationMinutes: number;
  exercises: ExerciseData[];
  isCircuit?: boolean;
  notes?: string;
}

// AI Coaching Types

export interface UserProfile {
  name: string;
  age: number;
  sport: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  goals: string;
  injuries: string;
  frequency: number; // days per week
  aiCoaching: boolean;
}

export interface ProgramExercise {
  name: string;
  sets: number;
  reps: string;
  rest?: string;
  notes?: string;
}

export interface DailyPlan {
  day: string; // e.g. "Monday"
  focus: string; // e.g. "Leg Power"
  type: SessionType;
  exercises: ProgramExercise[];
  isRestDay: boolean;
  completed: boolean;
}

export interface WeeklyPlan {
  id: string;
  weekStartDate: string;
  days: DailyPlan[];
  generatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  type: SessionType;
  description: string;
  defaultExercises: string[];
  // Optional detailed prescription from AI
  detailedExercises?: ProgramExercise[];
}
