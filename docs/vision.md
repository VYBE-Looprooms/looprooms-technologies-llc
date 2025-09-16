# VYBE LOOPROOMS™ – Full Vision Document

## 1. Overview
VYBE LOOPROOMS™ is a **mood-driven, AI-guided wellness and community platform**.  
It connects users with **Looprooms** (interactive spaces for Recovery, Meditation, Fitness, Wellness, and Healthy Living), guided by their emotions and goals.  

The platform merges:
- **Calm/Headspace** (wellness & meditation),
- **Twitch/YouTube Live** (creator-led video & interactivity),
- **Support groups (NA/AA)** (safe, anonymous-friendly recovery spaces),  
all within an **AI-powered emotional GPS system**.

---

## 2. Core Experience

### For Users
1. **Onboarding**
   - Signup/Login (Email, Google, Apple, optional anonymity for Recovery).
   - Choose interests (Recovery, Fitness, Meditation, Music, Healthy Living).
   - AI VYBE Match recommends Looprooms & Loopchains tailored to moods.

2. **Mood-to-Looproom System**
   - Users express how they feel (preset moods like Calm 😌, Energized ⚡, Supported 🤝 or free-text like “anxious”).
   - AI maps mood → best Looproom.
   - Example:
     - Anxious → Meditation Looproom
     - Lonely → Recovery Looproom
     - Low energy → Fitness Looproom
   - Emotional GPS → user is guided smoothly into the right room.

3. **Inside a Looproom**
   - **Video content** (live or pre-recorded).
   - **Playlist integration** (Spotify/YouTube/ambient audio).
   - **Chat & Emoji Reactions** (Socket.io).
   - Emoji triggers **motivational text** overlays in real-time.
   - **Confidence Meter** shows collective energy of participants.
   - **Next Room (Loopchain)** → recommended path forward.

4. **Loopchains**
   - Example flows:
     - Recovery → Meditation → Fitness
     - Meditation → Wellness
     - Fitness → Healthy Living
   - Keeps users moving across experiences.

5. **Positive Social Feed**
   - After sessions, users share uplifting progress posts.
   - No toxic comparisons, only encouragement.
   - Feed integrates with reactions and motivational elements.

---

### For Creators
1. **Onboarding & Verification**
   - Apply via platform.
   - Upload ID/license + selfie verification.
   - Admin approval required.

2. **Looproom Setup Wizard**
   - Choose Looproom type:
     - Live session
     - Pre-recorded class
     - Interactive group
     - 1-on-1
   - Upload profile image, description, tags.
   - Add Loopchain compatibility (e.g., “connect to Meditation + Fitness”).
   - Configure pricing (free, premium, exclusive).

3. **Content Upload**
   - Upload video, audio, or stream setup.
   - Integrate music/ambient playlists via APIs.

4. **Monetization**
   - Free rooms: teaser access.
   - Premium subscription ($10/mo).
   - Exclusive: per-creator or bundled subscriptions.
   - Payouts managed by VYBE platform.

5. **Extra Features**
   - Emoji/Confidence Meter boosts visibility.
   - Collaboration via Loopchains increases ecosystem reach.
   - Analytics for creators (views, engagement, reactions).

---

## 3. MVP Scope (40 Days)
Per contract, the Beta/MVP must include:

1. Landing/Login Page (functional).
2. Five Looprooms:
   - Recovery (NA/AA & Mental Health)
   - Meditation
   - Fitness
   - Wellness (Recovery & Healing)
   - Healthy Living (Cooking & Nutrition)
3. Loopchain functionality connecting the Looprooms.
4. Comment section + positive emoji reactions triggering motivational text.
5. Playlist integration (music/ambient).
6. Positive Social Feed (uplifting posts only).
7. Creator Onboarding (ID/license + selfie verification).

---

## 4. Technical Architecture

### Tech Stack
- **Frontend:** React / Next.js
- **Backend:** Node.js (Express)
- **Database:** PostgreSQL
- **Realtime:** Socket.io (chat & reactions)
- **Auth:** JWT-based (Email, Google, Apple)
- **Storage/Media:** Start with YouTube/Vimeo embeds → later AWS S3 + CDN
- **Music Integration:** Spotify API + YouTube embeds
- **Hosting:** Vercel (frontend) + Render/AWS (backend) + Supabase (DB)
- **Automation:** n8n (already running waitlist → can extend to onboarding flows)

### Database (Core Models)
- Users (roles: user, creator, admin)
- Creator Verification (ID docs, selfie, status)
- Looprooms (title, description, category, tags, video_url, creator_id)
- Loopchains (mapping: looproom_id → next_looproom_id)
- Comments (linked to looproom_id)
- Emoji Reactions (linked to looproom_id, triggers motivational_text)
- Posts (social feed)

---

## 5. Roadmap (High-Level)

### Phase 1 (Days 1–10) – Foundation
- Login/Signup + DB setup.
- Dashboard with mood input.
- Seed 5 Looprooms in DB.

### Phase 2 (Days 11–20) – Looprooms
- Looproom pages (video, description, chat).
- Emoji → motivational text system.
- Playlist integration (YouTube/Spotify).

### Phase 3 (Days 21–30) – Loopchains & Feed
- Loopchain navigation system.
- Positive social feed with posts + emoji reactions.

### Phase 4 (Days 31–40) – Creator Onboarding & Final Polish
- Creator verification flow (ID/license + selfie upload).
- Looproom Setup Wizard for creators.
- UI/UX polish + security testing.
- Beta deployment.

---

## 6. Differentiators
- Emotional GPS (mood → community → content).
- Safe Recovery Rooms (with anonymous option).
- Positive-Only Engagement (motivational-first).
- Creator Collaboration via Loopchains.
- Hybrid Monetization (subscription + exclusive).

---

## 7. Long-Term Vision
- **AI mood engine** replaces rule-based mapping.
- **Mobile apps** (React Native/Flutter).
- **Anonymous drop-in sessions** for Recovery.
- **Gamification**: streaks, rewards for positivity.
- **Creator monetization** (tiers, analytics, sponsorships).
- **Global ecosystem** where wellness creators grow together.

---

## 8. Final Goal
To build the **first mood-driven, community-first wellness platform** that adapts to users in real time, helps creators monetize positively, and connects people across Recovery, Meditation, Fitness, Wellness, and Healthy Living — all guided by **how they feel, not just what they click**.
