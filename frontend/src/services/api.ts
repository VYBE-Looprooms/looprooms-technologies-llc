// VYBE LOOPROOMS™ API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://192.168.3.10:3443';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://192.168.3.10:3001/ws';

// Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    current: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Looproom {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  contentType: string;
  contentUrl: string;
  duration?: number;
  difficulty?: string;
  isPremium: boolean;
  status: string;
  viewCount: number;
  reactionCount: number;
  saveCount: number;
  averageRating?: number;
  createdAt: string;
  publishedAt?: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color?: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export interface LiveSession {
  id: string;
  looproomId: string;
  title?: string;
  description?: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
  scheduledStartTime: string;
  actualStartTime?: string;
  endTime?: string;
  duration?: number;
  maxParticipants: number;
  currentParticipants: number;
  allowAnonymous: boolean;
  requiresApproval: boolean;
  isRecorded: boolean;
  looproom: {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    category: {
      id: string;
      name: string;
      slug: string;
      color?: string;
    };
  };
  creator: {
    id: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      displayName?: string;
      avatarUrl?: string;
    };
  };
  participants?: SessionParticipant[];
  comments?: SessionComment[];
}

export interface SessionParticipant {
  id: string;
  sessionId: string;
  userId: string;
  status: 'JOINED' | 'LEFT' | 'KICKED' | 'BANNED';
  isAnonymous: boolean;
  displayName?: string;
  isModerator: boolean;
  joinedAt: string;
  user: {
    id: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      displayName?: string;
      avatarUrl?: string;
    };
  };
}

export interface SessionComment {
  id: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  reactionCount: number;
  user: {
    id: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      displayName?: string;
      avatarUrl?: string;
    };
  };
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('vybe_token');
};

// Create axios-like request function
const apiRequest = async <T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<ApiResponse<T>> => {
  const { method = 'GET', body, headers = {} } = options;

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Looproom API methods
export const looproomApi = {
  // Get all looprooms
  getAll: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return apiRequest<Looproom[]>(`/api/looprooms?${queryParams}`);
  },

  // Get looproom by ID
  getById: async (id: string) => {
    return apiRequest<Looproom>(`/api/looprooms/${id}`);
  },

  // Create new looproom
  create: async (data: {
    title: string;
    description?: string;
    categoryId: string;
    contentType: string;
    contentUrl: string;
    thumbnail?: string;
    duration?: number;
    difficulty?: string;
    keywords?: string[];
    tags?: string[];
    isPremium?: boolean;
  }) => {
    return apiRequest<Looproom>('/api/looprooms', {
      method: 'POST',
      body: data,
    });
  },

  // Update looproom
  update: async (id: string, data: Partial<{
    title: string;
    description: string;
    categoryId: string;
    contentUrl: string;
    thumbnail: string;
    duration: number;
    difficulty: string;
    keywords: string[];
    isPremium: boolean;
    status: string;
  }>) => {
    return apiRequest<Looproom>(`/api/looprooms/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  // Delete looproom
  delete: async (id: string) => {
    return apiRequest(`/api/looprooms/${id}`, {
      method: 'DELETE',
    });
  },

  // Add reaction
  addReaction: async (id: string, type: 'HEART' | 'CLAP' | 'FIRE' | 'PEACE', isAnonymous = false) => {
    return apiRequest(`/api/looprooms/${id}/react`, {
      method: 'POST',
      body: { type, isAnonymous },
    });
  },

  // Remove reaction
  removeReaction: async (id: string, type?: string) => {
    return apiRequest(`/api/looprooms/${id}/react`, {
      method: 'DELETE',
      body: type ? { type } : {},
    });
  },

  // Increment view count
  incrementViews: async (id: string) => {
    return apiRequest(`/api/looprooms/${id}/view`, {
      method: 'POST',
    });
  },
};

// Live Session API methods
export const sessionApi = {
  // Create new session
  create: async (data: {
    looproomId: string;
    title?: string;
    description?: string;
    scheduledStartTime: string;
    duration?: number;
    maxParticipants?: number;
    allowAnonymous?: boolean;
    requiresApproval?: boolean;
    isRecorded?: boolean;
  }) => {
    return apiRequest<LiveSession>('/api/sessions', {
      method: 'POST',
      body: data,
    });
  },

  // Start session
  start: async (id: string) => {
    return apiRequest<LiveSession>(`/api/sessions/${id}/start`, {
      method: 'POST',
    });
  },

  // End session
  end: async (id: string) => {
    return apiRequest<LiveSession>(`/api/sessions/${id}/end`, {
      method: 'POST',
    });
  },

  // Join session
  join: async (id: string, isAnonymous = false, displayName?: string) => {
    return apiRequest<SessionParticipant>(`/api/sessions/${id}/join`, {
      method: 'POST',
      body: { isAnonymous, displayName },
    });
  },

  // Leave session
  leave: async (id: string, moodAfter?: any) => {
    return apiRequest(`/api/sessions/${id}/leave`, {
      method: 'POST',
      body: { moodAfter },
    });
  },

  // Get session details
  get: async (id: string) => {
    return apiRequest<LiveSession>(`/api/sessions/${id}`);
  },

  // Add comment
  addComment: async (id: string, content: string, isAnonymous = false) => {
    return apiRequest<SessionComment>(`/api/sessions/${id}/comments`, {
      method: 'POST',
      body: { content, isAnonymous },
    });
  },

  // Get active sessions for looproom
  getActiveForLooproom: async (looproomId: string) => {
    return apiRequest<LiveSession[]>(`/api/looprooms/${looproomId}/sessions/active`);
  },

  // Get sessions by user (for user's active sessions)
  getByUser: async (userId?: string) => {
    const endpoint = userId ? `/api/sessions/user/${userId}` : '/api/sessions/my';
    return apiRequest<LiveSession[]>(endpoint);
  },

  // Get upcoming sessions
  getUpcoming: async (limit = 10) => {
    return apiRequest<LiveSession[]>(`/api/sessions/upcoming?limit=${limit}`);
  },
};

// WebSocket connection manager
export class WebSocketManager {
  private ws: WebSocket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();

  connect() {
    this.token = getAuthToken();
    if (!this.token) {
      console.error('No auth token available for WebSocket connection');
      return;
    }

    const wsUrl = `${WS_URL}?token=${encodeURIComponent(this.token)}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('🔌 Connected to VYBE WebSocket');
        this.reconnectAttempts = 0;
        this.emit('connected', {});
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.emit(message.type, message.data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket connection closed');
        this.emit('disconnected', {});
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', { error });
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(type: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  // Event management
  on(event: string, callback: (data: any) => void) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  // Session-specific methods
  joinSession(sessionId: string) {
    this.send('join_session', { sessionId });
  }

  leaveSession(sessionId: string) {
    this.send('leave_session', { sessionId });
  }

  sendComment(sessionId: string, content: string, isAnonymous = false) {
    this.send('session_comment', { sessionId, content, isAnonymous });
  }

  sendReaction(sessionId: string, reactionType: string, targetType: string, targetId: string) {
    this.send('session_reaction', { sessionId, type: reactionType, targetType, targetId });
  }

  ping() {
    this.send('ping', {});
  }
}

// Categories API
export const categoryApi = {
  // Get all categories
  getAll: async () => {
    return apiRequest<Array<{
      id: string;
      name: string;
      slug: string;
      color?: string;
      description?: string;
      iconUrl?: string;
      looproomCount: number;
    }>>('/api/categories');
  },

  // Get category by slug
  getBySlug: async (slug: string) => {
    return apiRequest<{
      id: string;
      name: string;
      slug: string;
      color?: string;
      description?: string;
      iconUrl?: string;
      looproomCount: number;
      looprooms: Looproom[];
    }>(`/api/categories/${slug}`);
  },
};

// User Progress API
export const userProgressApi = {
  // Get user's progress data
  getProgress: async () => {
    return apiRequest<{
      totalSessions: number;
      streak: number;
      totalTimeSpent: number;
      completedJourneys: number;
      achievements: Array<{
        id: string;
        title: string;
        description: string;
        earnedAt: string;
        type: string;
      }>;
    }>('/api/user/progress');
  },

  // Get user's active journeys
  getActiveJourneys: async () => {
    return apiRequest<Array<{
      id: string;
      title: string;
      description: string;
      currentStep: number;
      totalSteps: number;
      progress: number;
      theme: string;
      nextSession?: string;
      nextSessionTime?: string;
      timeSpent: number;
      daysActive: number;
    }>>('/api/user/journeys/active');
  },
};

// Social Feed API
export const socialFeedApi = {
  // Get feed posts
  getPosts: async (params: {
    page?: number;
    limit?: number;
    type?: string;
    theme?: string;
    includeAnonymous?: boolean;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return apiRequest<Array<{
      id: string;
      author: {
        id: string;
        name: string;
        avatar?: string;
        isCreator: boolean;
        isVerified: boolean;
        title?: string;
      };
      content: string;
      timestamp: string;
      theme: string;
      isAnonymous: boolean;
      looproom?: {
        id: string;
        title: string;
        category: string;
        participants: number;
        isLive: boolean;
      };
      stats: {
        likes: number;
        comments: number;
        shares: number;
      };
      reactions: {
        fire: number;
        heart: number;
        growth: number;
        sparkle: number;
      };
      userReacted?: string;
      isBookmarked: boolean;
      comments: Array<{
        id: string;
        content: string;
        author: string;
        timestamp: string;
      }>;
    }>>(`/api/feed?${queryParams}`);
  },

  // Create new post
  createPost: async (data: {
    content: string;
    type?: string;
    isAnonymous?: boolean;
    looproomId?: string;
    loopchainId?: string;
  }) => {
    return apiRequest('/api/feed', {
      method: 'POST',
      body: data,
    });
  },

  // Add reaction to post
  addReaction: async (postId: string, type: string, isAnonymous = false) => {
    return apiRequest(`/api/feed/${postId}/react`, {
      method: 'POST',
      body: { type, isAnonymous },
    });
  },

  // Remove reaction from post
  removeReaction: async (postId: string) => {
    return apiRequest(`/api/feed/${postId}/react`, {
      method: 'DELETE',
    });
  },

  // Add comment to post
  addComment: async (postId: string, content: string, isAnonymous = false) => {
    return apiRequest(`/api/feed/${postId}/comment`, {
      method: 'POST',
      body: { content, isAnonymous },
    });
  },
};

// Export singleton instance
export const wsManager = new WebSocketManager();