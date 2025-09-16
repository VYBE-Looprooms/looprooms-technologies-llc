import { apiRequest, ApiResponse } from '@/lib/api';

export interface LooproomCategory {
  id: number;
  key: string;
  name: string;
  description?: string | null;
  themeColor?: string | null;
  icon?: string | null;
}

export interface LoopchainStepSummary {
  id: number;
  sequence: number;
  description?: string | null;
  nextLooproom: {
    id: number;
    slug: string;
    title: string;
    summary?: string | null;
    thumbnailUrl?: string | null;
    videoUrl?: string | null;
    playlistUrl?: string | null;
    category?: LooproomCategory | null;
  } | null;
}

export interface MotivationalMessageSummary {
  id: number;
  reactionType: string;
  message: string;
  displayWeight: number;
  isActive?: boolean;
}

export interface LooproomDetail {
  id: number;
  slug: string;
  title: string;
  summary?: string | null;
  description?: string | null;
  videoUrl?: string | null;
  playlistUrl?: string | null;
  thumbnailUrl?: string | null;
  isLive: boolean;
  status: string;
  startAt?: string | null;
  endAt?: string | null;
  category?: LooproomCategory | null;
  loopchain: LoopchainStepSummary[];
  motivationalMessages: MotivationalMessageSummary[];
}

export interface LooproomCategoryGroup {
  category: LooproomCategory | null;
  looprooms: LooproomDetail[];
}

export const listLooprooms = () =>
  apiRequest<LooproomDetail[]>('/api/looprooms');

export const getLooproomBySlug = (slug: string) =>
  apiRequest<LooproomDetail>(`/api/looprooms/${slug}`);

export const listLooproomCategories = () =>
  apiRequest<LooproomCategoryGroup[]>('/api/looprooms/categories');

export interface MoodRecommendationRequest {
  moodKey?: string;
  moodText?: string;
}

export interface MoodRecommendationResponse {
  mood: {
    requestedKey: string | null;
    resolvedKey: string;
    moodText: string | null;
    matchedKeyword: string | null;
  };
  recommended: LooproomDetail;
  loopchain: LoopchainStepSummary[];
  alternatives: LooproomDetail[];
}

export const recommendLooproom = (payload: MoodRecommendationRequest) =>
  apiRequest<MoodRecommendationResponse>('/api/moods/recommend', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
