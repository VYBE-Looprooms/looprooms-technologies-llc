# Development Plan

This document captures the implementation strategy for evolving the existing VYBE LOOPROOMS platform into the documented MVP while keeping the current Vite frontend. It defines scope, sequencing, and technical decisions for both frontend and backend services.

## Guiding Principles
- Build iteratively: ship foundational services before layering realtime and social features.
- Keep Vite + React + TypeScript on the client. Avoid migrations to other frameworks.
- Adopt Express + Sequelize + PostgreSQL on the server. Prefer structured services and modular routing.
- Maintain strong documentation and update the progress log (see `progress_log.md`) with every meaningful change.
- Prioritize security, validation, and positive-only interactions in line with the product vision.

## High-Level Workstreams
1. **Platform Foundation**
   - Configure PostgreSQL connection via Sequelize.
   - Define shared config, logging, and error handling utilities.
   - Establish environment variable structure for local, staging, and production targets.
2. **Authentication & User Management**
   - Implement email/password registration and login with JWT.
   - Integrate OAuth providers (Google, Apple) via appropriate libraries.
   - Support anonymous session token for recovery rooms.
3. **Looprooms & Loopchains**
   - CRUD APIs for looprooms, categories, playlists, and loopchain relations.
   - Seeding for the five MVP looprooms with static content.
   - Mood input endpoint returning recommended room or loopchain path.
4. **Engagement Layer**
   - Socket.io integration for chat and emoji reactions.
   - Motivational overlay triggers tied to reaction events.
   - Positive-only social feed with posts, comments, and reaction restrictions.
5. **Creator Onboarding**
   - Verification submission flow (ID/license upload + selfie capture metadata).
   - Admin moderation endpoints and dashboard views.
   - Creator looproom setup wizard with monetization flags.
6. **Experience Polish & Ops**
   - Transition animations between rooms.
   - Playlist integrations (Spotify, YouTube embeds) managed via reusable components.
   - Deployment scripts/config for Vercel frontend and Render/AWS backend.

## Backend Roadmap (Express + Sequelize)
### Phase A: Core Setup
- Add Sequelize, pg, and supporting packages.
- Create `config/database.js` to load connection parameters from env variables.
- Define base models and migrations for:
  - Users, Sessions, OAuthProfiles
  - LooproomCategories, Looprooms, LoopchainSteps
  - RoomMedia (video, playlist references)
  - RoomChatMessages, RoomReactions
  - SocialPosts, SocialPostReactions, SocialPostComments
  - CreatorProfiles, CreatorVerifications
  - MotivationalMessages
- Implement migration/seeding scripts and document execution.

### Phase B: Auth & Mood Dashboard APIs
- REST endpoints for auth (`/api/auth/*`), session refresh, and profile retrieval.
- Mood submission endpoint returning recommended looproom and loopchain data.
- Secure middleware for role-based access and anonymous recovery sessions.

### Phase C: Looproom Delivery
- Looproom detail endpoint exposing video, playlists, chat token, and motivational configuration.
- Loopchain navigation endpoint returning next steps.
- CRUD for admin to manage rooms and creators.

### Phase D: Engagement Services
- Socket.io namespace for looprooms with chat persistence.
- Reaction postback storing aggregated metrics and triggering motivational text.
- Positive social feed endpoints with moderation hooks.

### Phase E: Creator Operations
- Upload handling (temporary local storage with future S3 adapter).
- Verification workflow with status transitions and admin decisions.
- Creator dashboard endpoints for analytics stubs.

## Frontend Roadmap (Vite + React)
1. **State & API Layer**
   - Introduce Axios/fetch wrapper, React Query integrations, and shared types.
   - Centralize env config (API base URL, Socket endpoint, media origins).
2. **Authentication Flow**
   - Create sign in, sign up, and OAuth callback routes.
   - Persist JWT/session in httpOnly cookies or secure storage.
   - Implement protected layout for authenticated areas.
3. **Mood Dashboard**
   - After login, present mood selector, recommended looproom, and CTA into experience.
   - Display seeded looprooms and active loopchains.
4. **Looproom Experience**
   - Room page with video player, playlist controls, chat panel, reaction tray, and motivational overlay component.
   - Transition animations using existing GSAP utilities.
5. **Social Feed**
   - Positive-only feed with post composer (validation for sentiment enforced server-side).
   - Reaction UI synced with backend restrictions.
6. **Creator Portal**
   - Verification submission form with file upload and selfie capture (webcam support where available).
   - Room setup wizard with playlist embedding helpers and pricing toggles.
   - Admin console pages for reviewing submissions.
7. **Shared Components & Theming**
   - Expand shadcn component usage for new flows.
   - Maintain design tokens consistent with existing marketing site.

## Database & Environment Configuration
- **Database**: PostgreSQL database `vybe` (user `postgres`, password `SATOSANb6...`). Credentials must reside in `.env` (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).
- **Sequelize CLI**: Add commands for `db:migrate`, `db:seed`, `db:rollback`.
- **Migrations**: Prefer timestamped files; document naming conventions.
- **Seed Data**: Provide JSON-backed seed files for initial looprooms and motivational copy.

## Testing & Quality
- Establish Jest + Supertest for backend endpoints.
- Use React Testing Library for key frontend flows (auth, mood flow, looproom entry).
- Set up ESLint/Prettier consistency (already partially configured).
- Document manual QA scenarios per milestone.

## Documentation Expectations
- Update `docs/progress_log.md` after each milestone.
- Add API reference (`docs/api.md`) as endpoints stabilize.
- Maintain ERD diagrams or textual representation within this plan when schema evolves.

## Immediate Next Steps
1. Build looproom query endpoints delivering seeded categories, looprooms, and loopchain navigation for the dashboard.
2. Seed motivational messages and reaction presets to support positive-only engagement flows.
3. Stand up the mood dashboard experience (frontend) to consume looproom recommendations.
4. Implement protected-route guardrails and session renewal logic on frontend/backend (refresh tokens or token rotation).

