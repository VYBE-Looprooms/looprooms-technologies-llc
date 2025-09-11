import { createContext } from 'react';

// Types based on our database schema
export interface User {
  id: string;
  email: string;
  username?: string;
  role: 'MEMBER' | 'CREATOR' | 'MODERATOR' | 'ADMIN';
  isVerified: boolean;
  profile?: {
    id: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    wellnessGoals: string[];
    currentStreakDays: number;
    totalStreakDays: number;
    completedLoopchains: number;
    vibesShared: number;
    positiveReactions: number;
  };
  subscription?: {
    id: string;
    tier: 'FREE' | 'PREMIUM_MONTHLY' | 'PREMIUM_YEARLY' | 'CREATOR_PRO';
    status: 'ACTIVE' | 'CANCELED' | 'EXPIRED' | 'TRIAL';
    currentPeriodEnd: string;
  };
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User['profile']>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  applyForCreator?: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
