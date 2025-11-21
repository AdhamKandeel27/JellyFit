
import { Template, SessionType } from './types';

export const MOCK_HISTORY_DATA = [
  { name: 'Mon', duration: 45 },
  { name: 'Tue', duration: 60 },
  { name: 'Wed', duration: 0 },
  { name: 'Thu', duration: 55 },
  { name: 'Fri', duration: 90 },
  { name: 'Sat', duration: 120 },
  { name: 'Sun', duration: 30 },
];

export const PADEL_TEMPLATES: Template[] = [
  {
    id: 'strength-1',
    name: 'Padel Power',
    type: SessionType.STRENGTH,
    description: 'Explosive strength for smashes and fast court movement.',
    defaultExercises: ['Squat Jumps', 'Medicine Ball Slams', 'Lateral Lunges', 'Push Press']
  },
  {
    id: 'mobility-1',
    name: 'Court Flow',
    type: SessionType.MOBILITY,
    description: 'Hip and shoulder mobility essential for rotation.',
    defaultExercises: ['90/90 Hip Switch', 'Thoracic Rotations', 'Cat-Cow', 'Wrist Mobility']
  },
  {
    id: 'perf-1',
    name: 'Match Ready',
    type: SessionType.PERFORMANCE,
    description: 'High intensity intervals mimicking rally length.',
    defaultExercises: ['Shuttle Runs', 'Shadow Swings', 'Ladder Drills', 'Box Jumps']
  },
  {
    id: 'circuit-1',
    name: 'Full Body Circuit',
    type: SessionType.CIRCUIT,
    description: 'Endurance and conditioning circuit.',
    defaultExercises: ['Burpees', 'Kettlebell Swings', 'Plank', 'Mountain Climbers']
  }
];
