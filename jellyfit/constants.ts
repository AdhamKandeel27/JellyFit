import { SessionType, Template } from './types';

export const PADEL_TEMPLATES: Template[] = [
  {
    id: 't1',
    name: 'Explosive Strength',
    type: SessionType.STRENGTH,
    description: 'Focus on squats, lunges, and upper body power for smash defense.',
    defaultExercises: ['Goblet Squats', 'Romanian Deadlifts', 'Push Press', 'Rotational Cable Woodchops']
  },
  {
    id: 't2',
    name: 'Court Mobility',
    type: SessionType.MOBILITY,
    description: 'Open up hips and thoracic spine for better court coverage.',
    defaultExercises: ['90/90 Hip Switch', 'Thoracic Rotation', 'Cat-Cow', 'World\'s Greatest Stretch']
  },
  {
    id: 't3',
    name: 'Agility & Speed',
    type: SessionType.AGILITY,
    description: 'Ladder drills and reaction time improvements.',
    defaultExercises: ['Ladder Icky Shuffle', 'Cone Zig-Zag', 'Split Step Reaction', 'Lateral Bounds']
  },
  {
    id: 't4',
    name: 'Padel Circuit',
    type: SessionType.CIRCUIT,
    description: 'High intensity intervals to mimic long rallies.',
    defaultExercises: ['Burpees', 'Box Jumps', 'Medicine Ball Slams', 'Plank Hold']
  }
];

export const MOCK_HISTORY_DATA = [
  { name: 'Mon', duration: 45, sessions: 1 },
  { name: 'Tue', duration: 0, sessions: 0 },
  { name: 'Wed', duration: 60, sessions: 1 },
  { name: 'Thu', duration: 30, sessions: 1 },
  { name: 'Fri', duration: 0, sessions: 0 },
  { name: 'Sat', duration: 90, sessions: 2 },
  { name: 'Sun', duration: 0, sessions: 0 },
];