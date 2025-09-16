# Looproom & Mood API Overview

## Endpoints

### GET /api/looprooms
Returns all looprooms seeded for the MVP, including category metadata and ordered loopchain steps.

**Response**
```
{
  "success": true,
  "message": "Looprooms retrieved successfully",
  "data": [
    {
      "id": 1,
      "slug": "recovery-anchor-circle",
      "title": "Recovery Anchor Circle",
      "summary": "Daily grounding room...",
      "description": "...",
      "videoUrl": "https://...",
      "playlistUrl": "https://...",
      "thumbnailUrl": "/images/looprooms/recovery-anchor.jpg",
      "isLive": false,
      "status": "active",
      "category": {
        "key": "recovery",
        "name": "Recovery Room",
        "themeColor": "#60A5FA",
        "icon": "heart-pulse"
      },
      "loopchain": [
        {
          "sequence": 1,
          "nextLooproom": {
            "slug": "meditation-breathe-release",
            "title": "Meditation: Breathe + Release",
            "category": { "key": "meditation", "themeColor": "#22D3EE" }
          }
        },
        {
          "sequence": 2,
          "nextLooproom": {
            "slug": "fitness-spark-session",
            "title": "Fitness Spark Session"
          }
        }
      ],
      "motivationalMessages": [
        {
          "id": 1,
          "reactionType": "anchor",
          "message": "We are holding space with you...",
          "displayWeight": 3
        }
      ]
    }
  ]
}
```

### GET /api/looprooms/:slug
Fetch a single looproom with identical schema to the list view. Returns 404 if not found.

### GET /api/looprooms/categories
Groups looprooms by category, returning
```
{
  "category": { "key": "recovery", "name": "Recovery Room", ... },
  "looprooms": [ { ... }, ... ]
}
```

### POST /api/moods/recommend
Generates a mood-driven recommendation. Accepts either `moodKey` (preset) or free-text `moodText`.

**Request**
```
{
  "moodKey": "calm"
}
```

**Response**
```
{
  "success": true,
  "message": "Mood recommendation generated successfully",
  "data": {
    "mood": {
      "requestedKey": "calm",
      "resolvedKey": "calm",
      "matchedKeyword": "calm"
    },
    "recommended": { ...looproom payload... },
    "loopchain": [ ...ordered steps... ],
    "alternatives": [ { ...looproom... }, ... ]
  }
}
```

- `resolvedKey` is inferred from presets if free text is provided.
- `alternatives` surfaces three other looprooms to keep journeys flexible.

## Mood Presets
Default mappings live in `backend/services/looproomService.js`:

| Mood key   | Keywords                              | Looproom slug                  |
|-----------|---------------------------------------|--------------------------------|
| calm      | calm, peaceful, balanced, present     | meditation-breathe-release     |
| anxious   | anxious, overwhelmed, stressed, panic | recovery-anchor-circle         |
| lonely    | lonely, alone, support, connection    | recovery-anchor-circle         |
| energized | energized, motivated, strong, ready   | fitness-spark-session          |
| drained   | drained, tired, burned out, heavy     | wellness-reset-lab             |
| curious   | curious, inspired, learning, creative | healthy-living-nourish-lab     |

Fallback slug defaults to the Wellness Reset Lab to give users a restorative option.

## Implementation Notes
- All serializers convert snake_case DB fields into camelCase API responses.
- Loopchain steps are ordered by `sequence` and include the next looproom’s basic metadata plus category theme colors.
- Validation for `/api/moods/recommend` requires at least one of `moodKey` or `moodText` (`middleware/validation.js`).
- The new routes are mounted in `server.js` and logged on startup, keeping parity with documentation.
### GET /api/engagement/reactions
Surfaces the seeded reaction presets used to trigger motivational overlays. Each preset exposes UI metadata for emoji, label, theme color, and ordering.

**Response**
```
{
  "success": true,
  "message": "Reaction presets retrieved successfully",
  "data": [
    {
      "id": 1,
      "key": "breathe",
      "label": "Deep Breath",
      "emoji": "??",
      "description": "Gentle reminder to inhale, exhale, and recentre together.",
      "themeColor": "#22d3ee",
      "displayOrder": 1
    }
  ]
}
```

### GET /api/engagement/motivations
Returns the motivational copy seeded for each looproom/reaction pairing. Used by clients to display supportive overlays whenever reactions fire.

**Response**
```
{
  "success": true,
  "message": "Motivational messages retrieved successfully",
  "data": [
    {
      "id": 1,
      "reactionType": "anchor",
      "message": "We are holding space with you...",
      "displayWeight": 3,
      "looproom": {
        "id": 1,
        "slug": "recovery-anchor-circle",
        "title": "Recovery Anchor Circle"
      }
    }
  ]
}
```

Use `/api/looprooms` to hydrate looproom details and `/api/engagement/*` to layer the seeded positive-only engagement assets on top of the experience.
