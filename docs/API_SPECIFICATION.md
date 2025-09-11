# VYBE LOOPROOMS™ - API Design Specification

> **Version**: 1.0  
> **Date**: September 11, 2025  
> **Base URL**: `https://api.feelyourvybe.com/v1` (Production)  
> **Base URL**: `http://localhost:3001/v1` (Development)  

## 🔐 Authentication

All API endpoints (except public ones) require authentication via JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

### **Authentication Endpoints**

#### **POST** `/auth/register`
Create a new user account.

```json
// Request
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "authProvider": "EMAIL"
}

// Response (201)
{
  "success": true,
  "data": {
    "user": {
      "id": "clu123...",
      "email": "user@example.com",
      "role": "MEMBER",
      "isVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **POST** `/auth/login`
Authenticate existing user.

```json
// Request
{
  "email": "user@example.com",
  "password": "securePassword123"
}

// Response (200)
{
  "success": true,
  "data": {
    "user": {
      "id": "clu123...",
      "email": "user@example.com",
      "role": "MEMBER",
      "profile": {
        "displayName": "John Doe",
        "avatarUrl": "https://...",
        "currentMood": {...}
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **POST** `/auth/oauth`
OAuth authentication (Google/Apple).

```json
// Request
{
  "provider": "GOOGLE",
  "authCode": "oauth_auth_code",
  "redirectUri": "https://feelyourvybe.com/auth/callback"
}
```

---

## 👤 User Management

#### **GET** `/users/me`
Get current user profile.

```json
// Response (200)
{
  "success": true,
  "data": {
    "id": "clu123...",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "MEMBER",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "displayName": "John Doe",
      "bio": "Wellness enthusiast...",
      "avatarUrl": "https://...",
      "currentMood": {...},
      "wellnessGoals": ["mindfulness", "fitness"],
      "stats": {
        "totalStreakDays": 15,
        "completedLoopchains": 3,
        "vibesShared": 12
      }
    },
    "subscription": {
      "tier": "PREMIUM_MONTHLY",
      "status": "ACTIVE",
      "currentPeriodEnd": "2025-10-11T00:00:00Z"
    }
  }
}
```

#### **PUT** `/users/me`
Update current user profile.

```json
// Request
{
  "profile": {
    "displayName": "John Smith",
    "bio": "Updated bio...",
    "currentMood": {"energy": 8, "focus": 7},
    "wellnessGoals": ["meditation", "recovery"]
  },
  "privacy": {
    "defaultPrivacyLevel": "FRIENDS_ONLY",
    "allowsAnonymousMode": true
  }
}
```

---

## 📚 Content Management

### **Categories**

#### **GET** `/categories`
Get all content categories.

```json
// Response (200)
{
  "success": true,
  "data": [
    {
      "id": "cat_recovery",
      "name": "Recovery",
      "slug": "recovery",
      "description": "Support for addiction recovery and healing",
      "color": "#10B981",
      "iconUrl": "https://...",
      "looproomCount": 45
    },
    {
      "id": "cat_wellness",
      "name": "Wellness",
      "slug": "wellness",
      "description": "General wellness and healthy living content",
      "color": "#3B82F6",
      "iconUrl": "https://...",
      "looproomCount": 78
    }
  ]
}
```

### **Looprooms**

#### **GET** `/looprooms`
Get Looprooms with filtering and pagination.

**Query Parameters:**
- `category` - Filter by category slug
- `tags` - Comma-separated tag names
- `search` - Search in title/description
- `difficulty` - Filter by difficulty level
- `premium` - Filter premium content (`true`/`false`)
- `sort` - Sort by (`trending`, `newest`, `popular`, `rating`)
- `cursor` - Pagination cursor
- `limit` - Results per page (default: 20, max: 100)

```json
// Response (200)
{
  "success": true,
  "data": {
    "looprooms": [
      {
        "id": "loop_123",
        "title": "Morning Meditation for Recovery",
        "slug": "morning-meditation-recovery",
        "description": "Start your day with mindfulness...",
        "thumbnail": "https://...",
        "contentType": "VIDEO",
        "duration": 900,
        "category": {
          "id": "cat_recovery",
          "name": "Recovery",
          "color": "#10B981"
        },
        "creator": {
          "id": "user_456",
          "displayName": "Sarah Johnson",
          "avatarUrl": "https://...",
          "isVerified": true
        },
        "tags": ["meditation", "morning", "mindfulness"],
        "stats": {
          "viewCount": 1250,
          "reactionCount": 89,
          "averageRating": 4.8
        },
        "isPremium": false,
        "userEngagement": {
          "hasViewed": true,
          "hasReacted": false,
          "isSaved": true,
          "reaction": null
        }
      }
    ],
    "pagination": {
      "hasMore": true,
      "nextCursor": "eyJpZCI6Imxvb3BfMTI0In0",
      "total": 156
    }
  }
}
```

#### **GET** `/looprooms/{id}`
Get single Looproom details.

```json
// Response (200)
{
  "success": true,
  "data": {
    "id": "loop_123",
    "title": "Morning Meditation for Recovery",
    "slug": "morning-meditation-recovery",
    "description": "Start your day with mindfulness and intention...",
    "thumbnail": "https://...",
    "contentType": "VIDEO",
    "contentUrl": "https://...",
    "duration": 900,
    "transcription": "Welcome to this morning meditation...",
    "keywords": ["meditation", "recovery", "morning", "mindfulness"],
    "difficulty": "Beginner",
    "category": {...},
    "creator": {...},
    "tags": [...],
    "stats": {...},
    "isPremium": false,
    "previewDuration": null,
    "relatedLooprooms": [...],
    "userEngagement": {...}
  }
}
```

#### **POST** `/looprooms/{id}/view`
Track Looproom view/play.

```json
// Request
{
  "watchTime": 450,
  "completed": false,
  "confidenceLevel": 7
}

// Response (200)
{
  "success": true,
  "message": "View tracked successfully"
}
```

---

## 🔗 Loopchains (Guided Journeys)

#### **GET** `/loopchains`
Get available Loopchains.

```json
// Response (200)
{
  "success": true,
  "data": {
    "loopchains": [
      {
        "id": "chain_recovery_starter",
        "title": "Recovery Foundation Journey",
        "slug": "recovery-foundation-journey",
        "description": "A 7-day journey to build recovery foundations",
        "thumbnail": "https://...",
        "creator": {...},
        "estimatedDuration": 420,
        "difficulty": "Beginner",
        "goals": ["recovery", "mindfulness", "routine"],
        "stats": {
          "enrollmentCount": 234,
          "completionCount": 156,
          "averageRating": 4.9
        },
        "isPremium": false,
        "stepCount": 7,
        "userProgress": {
          "isEnrolled": true,
          "status": "IN_PROGRESS",
          "currentStep": 3,
          "progressPercent": 42.8,
          "startedAt": "2025-09-05T10:00:00Z"
        }
      }
    ],
    "pagination": {...}
  }
}
```

#### **GET** `/loopchains/{id}`
Get Loopchain details with steps.

```json
// Response (200)
{
  "success": true,
  "data": {
    "id": "chain_recovery_starter",
    "title": "Recovery Foundation Journey",
    "description": "A comprehensive 7-day journey...",
    "steps": [
      {
        "id": "step_1",
        "stepNumber": 1,
        "title": "Understanding Recovery",
        "description": "Learn the foundations...",
        "looproom": {
          "id": "loop_123",
          "title": "Recovery Basics",
          "thumbnail": "https://...",
          "duration": 600
        },
        "isOptional": false,
        "minCompletionTime": 300,
        "userProgress": {
          "status": "COMPLETED",
          "completedAt": "2025-09-06T11:30:00Z",
          "timeSpent": 720,
          "confidenceLevel": 8
        }
      }
    ],
    "userProgress": {...}
  }
}
```

#### **POST** `/loopchains/{id}/enroll`
Enroll in a Loopchain.

```json
// Response (201)
{
  "success": true,
  "data": {
    "userProgress": {
      "id": "progress_123",
      "status": "IN_PROGRESS",
      "currentStep": 1,
      "progressPercent": 0,
      "startedAt": "2025-09-11T15:30:00Z"
    }
  }
}
```

---

## 🌟 Shared VYBES (Social Feed)

#### **GET** `/vybes/feed`
Get personalized social feed.

**Query Parameters:**
- `type` - Filter by vybe type
- `privacy` - Filter by privacy level
- `following` - Show only from followed users (`true`/`false`)
- `cursor` - Pagination cursor
- `limit` - Results per page (default: 20)

```json
// Response (200)
{
  "success": true,
  "data": {
    "vybes": [
      {
        "id": "vybe_123",
        "type": "REFLECTION",
        "content": "Today's Recovery Looproom helped me stay focused on my goals. Grateful for this community! 🙏",
        "author": {
          "id": "user_456",
          "displayName": "Sarah J.",
          "avatarUrl": "https://...",
          "isAnonymous": false
        },
        "looproom": {
          "id": "loop_123",
          "title": "Morning Recovery Meditation",
          "thumbnail": "https://..."
        },
        "privacy": "PUBLIC",
        "stats": {
          "reactionCount": 24,
          "commentCount": 8,
          "shareCount": 3
        },
        "userEngagement": {
          "hasReacted": true,
          "reaction": "HEART",
          "hasCommented": false,
          "hasShared": false
        },
        "createdAt": "2025-09-11T14:30:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

#### **POST** `/vybes`
Create a new shared vybe.

```json
// Request
{
  "type": "REFLECTION",
  "content": "Amazing session in the Fitness Looproom today! Feeling stronger already 💪",
  "looproomId": "loop_456",
  "privacyLevel": "PUBLIC",
  "isAnonymous": false
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "vybe_124",
    "type": "REFLECTION",
    "content": "Amazing session in the Fitness Looproom today!...",
    "author": {...},
    "looproom": {...},
    "createdAt": "2025-09-11T15:45:00Z"
  }
}
```

#### **POST** `/vybes/{id}/react`
React to a shared vybe.

```json
// Request
{
  "type": "HEART",
  "isAnonymous": false
}

// Response (200)
{
  "success": true,
  "data": {
    "reaction": {
      "id": "reaction_123",
      "type": "HEART",
      "isAnonymous": false,
      "createdAt": "2025-09-11T15:50:00Z"
    }
  }
}
```

#### **POST** `/vybes/{id}/comments`
Comment on a shared vybe.

```json
// Request
{
  "content": "This is so inspiring! Keep going! 🌟",
  "isAnonymous": false
}

// Response (201)
{
  "success": true,
  "data": {
    "comment": {
      "id": "comment_123",
      "content": "This is so inspiring! Keep going! 🌟",
      "author": {
        "displayName": "John D.",
        "avatarUrl": "https://..."
      },
      "isAnonymous": false,
      "createdAt": "2025-09-11T15:55:00Z"
    }
  }
}
```

---

## 💾 User Collections

#### **GET** `/looplist`
Get user's saved Looprooms.

```json
// Response (200)
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "looplist_123",
        "looproom": {...},
        "notes": "Great for morning routine",
        "isFavorite": true,
        "createdAt": "2025-09-10T09:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

#### **POST** `/looplist/{looproomId}`
Save Looproom to personal list.

```json
// Request
{
  "notes": "Perfect for evening wind-down",
  "isFavorite": true
}

// Response (201)
{
  "success": true,
  "message": "Looproom saved to your list"
}
```

---

## 📊 Analytics & Progress

#### **GET** `/progress/dashboard`
Get user progress dashboard data.

```json
// Response (200)
{
  "success": true,
  "data": {
    "streaks": {
      "current": 15,
      "longest": 23,
      "lastActivity": "2025-09-11T14:30:00Z"
    },
    "completions": {
      "looprooms": 45,
      "loopchains": 3,
      "thisWeek": 8
    },
    "socialEngagement": {
      "vybesShared": 12,
      "reactionsReceived": 89,
      "commentsReceived": 34
    },
    "wellnessMetrics": {
      "moodTrend": "improving",
      "confidenceAverage": 7.2,
      "goalsProgress": {
        "mindfulness": 78,
        "recovery": 85,
        "fitness": 45
      }
    },
    "recentActivity": [...]
  }
}
```

---

## 💳 Subscription Management

#### **GET** `/subscription`
Get current subscription status.

```json
// Response (200)
{
  "success": true,
  "data": {
    "tier": "PREMIUM_MONTHLY",
    "status": "ACTIVE",
    "currentPeriodStart": "2025-09-11T00:00:00Z",
    "currentPeriodEnd": "2025-10-11T00:00:00Z",
    "cancelAtPeriodEnd": false,
    "features": [
      "unlimited_looprooms",
      "full_loopchain_access",
      "advanced_analytics",
      "priority_support"
    ]
  }
}
```

#### **POST** `/subscription/checkout`
Create Stripe checkout session for subscription.

```json
// Request
{
  "tier": "PREMIUM_MONTHLY",
  "successUrl": "https://feelyourvybe.com/subscription/success",
  "cancelUrl": "https://feelyourvybe.com/subscription/cancel"
}

// Response (200)
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/pay/cs_..."
  }
}
```

---

## 🔒 Privacy & Safety

#### **POST** `/reports`
Report content or user.

```json
// Request
{
  "reportedType": "shared_vybe",
  "reportedId": "vybe_123",
  "type": "INAPPROPRIATE_CONTENT",
  "description": "This content violates community guidelines..."
}

// Response (201)
{
  "success": true,
  "message": "Report submitted successfully"
}
```

#### **POST** `/users/{id}/block`
Block a user.

```json
// Response (200)
{
  "success": true,
  "message": "User blocked successfully"
}
```

---

## 📝 Error Handling

### **Standard Error Response Format**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Valid email is required"
      }
    ]
  },
  "timestamp": "2025-09-11T15:30:00Z",
  "requestId": "req_123456"
}
```

### **Common Error Codes**
- `AUTHENTICATION_REQUIRED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `VALIDATION_ERROR` (400)
- `RATE_LIMIT_EXCEEDED` (429)
- `INTERNAL_SERVER_ERROR` (500)
- `SUBSCRIPTION_REQUIRED` (402)

---

## 🚀 Rate Limiting

### **Rate Limits by Endpoint Type**
- **Authentication**: 5 requests/minute
- **Content consumption**: 100 requests/minute
- **Social interactions**: 30 requests/minute
- **Content creation**: 10 requests/minute
- **Reports/moderation**: 5 requests/minute

### **Rate Limit Headers**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1694441400
```

---

This API specification provides a comprehensive foundation for the VYBE LOOPROOMS™ platform, supporting all features outlined in the PRD while maintaining RESTful principles and scalability.
