import { apiRequest } from '@/lib/api';

export interface ReactionPreset {
  id: number;
  key: string;
  label: string;
  emoji: string;
  description?: string | null;
  themeColor?: string | null;
  displayOrder: number;
}

export interface MotivationalMessage {
  id: number;
  reactionType: string;
  message: string;
  displayWeight: number;
  looproom?: {
    id: number;
    slug: string;
    title: string;
  } | null;
}

export const fetchReactionPresets = () =>
  apiRequest<ReactionPreset[]>('/api/engagement/reactions');

export const fetchMotivationalMessages = () =>
  apiRequest<MotivationalMessage[]>('/api/engagement/motivations');
