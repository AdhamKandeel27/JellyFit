
import { Session, UserProfile, WeeklyPlan } from '../types';

const KEYS = {
  SESSIONS: 'jellyfit_sessions',
  PROFILE: 'jellyfit_profile',
  WEEKLY_PLAN: 'jellyfit_weekly_plan'
};

export const storageService = {
  // Sessions
  getSessions: (): Session[] => {
    try {
      const data = localStorage.getItem(KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load sessions", e);
      return [];
    }
  },

  saveSession: (session: Session) => {
    try {
      const current = storageService.getSessions();
      const updated = [session, ...current];
      localStorage.setItem(KEYS.SESSIONS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error("Failed to save session", e);
      return [];
    }
  },

  // User Profile
  getUserProfile: (): UserProfile | null => {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveUserProfile: (profile: UserProfile) => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  // Weekly Plan
  getWeeklyPlan: (): WeeklyPlan | null => {
    try {
      const data = localStorage.getItem(KEYS.WEEKLY_PLAN);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveWeeklyPlan: (plan: WeeklyPlan) => {
    localStorage.setItem(KEYS.WEEKLY_PLAN, JSON.stringify(plan));
  },

  // Helper to mark a day as complete in the current plan
  markPlanDayComplete: (dayName: string) => {
    const plan = storageService.getWeeklyPlan();
    if (plan) {
      const updatedDays = plan.days.map(d => 
        d.day === dayName ? { ...d, completed: true } : d
      );
      storageService.saveWeeklyPlan({ ...plan, days: updatedDays });
    }
  }
};
