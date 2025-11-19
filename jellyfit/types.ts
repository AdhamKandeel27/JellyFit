export enum SessionType {
  STRENGTH = 'Strength Training',
  MOBILITY = 'Mobility / Flexibility',
  PERFORMANCE = 'Performance & Power',
  AGILITY = 'Coordination & Agility',
  CIRCUIT = 'Circuit Conditioning',
  CUSTOM = 'Custom Session'
}

export interface SetData {
  id: string;
  reps: number | null;
  weight: number | null; // in kg
  time: number | null; // in seconds
  completed: boolean;
}

export interface ExerciseData {
  id: string;
  name: string;
  sets: SetData[];
  mediaUrl?: string; // Blob URL for MVP
  mediaType?: 'image' | 'video';
  notes?: string;
  isTimed?: boolean;
}

export interface Session {
  id: string;
  date: string; // ISO string
  type: SessionType;
  durationMinutes: number;
  exercises: ExerciseData[];
  isCircuit?: boolean;
  notes?: string;
}

export interface Template {
  id: string;
  name: string;
  type: SessionType;
  description: string;
  defaultExercises: string[]; // Array of exercise names
}

export type ViewState = 'dashboard' | 'history' | 'new-session' | 'active-session' | 'session-details';