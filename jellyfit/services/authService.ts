
import { User } from '../types';

const KEYS = {
  CURRENT_USER: 'jellyfit_current_user',
  USERS_DB: 'jellyfit_users_db' // Simulating a database
};

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const db = JSON.parse(localStorage.getItem(KEYS.USERS_DB) || '[]');
    const user = db.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const sessionUser: User = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(sessionUser));
    return sessionUser;
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const db = JSON.parse(localStorage.getItem(KEYS.USERS_DB) || '[]');
    
    if (db.find((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password // In a real app, never store plain text passwords!
    };

    db.push(newUser);
    localStorage.setItem(KEYS.USERS_DB, JSON.stringify(db));

    const sessionUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    };

    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(sessionUser));
    return sessionUser;
  },

  mockGoogleLogin: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sessionUser: User = {
      id: 'google-user-123',
      name: 'Google User',
      email: 'user@gmail.com',
      avatarUrl: 'https://ui-avatars.com/api/?name=Google+User&background=0D8ABC&color=fff'
    };
    
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(sessionUser));
    return sessionUser;
  },

  logout: () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }
};
