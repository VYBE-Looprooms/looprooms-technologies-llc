import { createContext } from 'react';

export interface User {
  id: string;
  email: string;
  username?: string;
  role: 'USER' | 'CREATOR' | 'ADMIN';
  isVerified: boolean;
  isActive: boolean;
  profile: {
    id: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    currentMood?: string;
    wellnessGoals?: string[];
    totalStreakDays: number;
    currentStreakDays: number;
    completedLoopchains: number;
    vibesShared: number;
    positiveReactions: number;
    showStats: boolean;
    showProgress: boolean;
    allowDirectMessages: boolean;
  };
  subscription?: {
    id: string;
    tier: 'FREE' | 'CREATOR' | 'PREMIUM';
    status: 'ACTIVE' | 'INACTIVE' | 'TRIAL' | 'CANCELLED';
    currentPeriodEnd?: Date;
  };
  creatorApplication?: {
    id: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    firstName?: string;
    lastName?: string;
    bio?: string;
    interestedCategories?: string[];
    primaryCategory?: string;
    faceVerificationCompleted: boolean;
    faceVerificationScore?: number;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  bio?: string;
  interestedCategories?: string[];
  primaryCategory?: string;
  isCreatorApplication?: boolean;
  allowsAnonymousMode?: boolean;
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<User['profile']>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
