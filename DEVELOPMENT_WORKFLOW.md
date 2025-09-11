# Development Workflow: Waitlist vs Full App Mode

This document outlines how to continue development while keeping the production version in waitlist mode.

## Overview

Your project now supports two modes:
- **Waitlist Mode**: Shows only the waitlist page (production default)
- **Development Mode**: Shows the full app with all pages (development default)

## Branch Strategy

### Main Branch (`main`)
- **Purpose**: Production-ready code
- **Vercel Deployment**: ✅ Auto-deploys to production
- **Environment**: Waitlist mode enabled (`VITE_ENABLE_WAITLIST=true`)
- **Users See**: Waitlist page only

### Development Branch (`development`)
- **Purpose**: Active development
- **Vercel Deployment**: ❌ No auto-deployment
- **Environment**: Full app mode (`VITE_ENABLE_WAITLIST=false`)
- **You See**: Complete app for development

## Environment Variables

### Production (`.env.production`)
```bash
VITE_API_URL=https://api.feelyourvybe.com
VITE_ENABLE_WAITLIST=true
VITE_APP_MODE=waitlist
```

### Development (`.env.local`)
```bash
VITE_API_URL=http://localhost:3001
VITE_ENABLE_WAITLIST=false
VITE_APP_MODE=development
```

## Development Workflow

### 1. Daily Development
```bash
# Work on development branch
git checkout development

# Make your changes (login, dashboard, etc.)
# Test locally - you'll see the full app

# Commit and push changes
git add .
git commit -m "feat: add login functionality"
git push origin development
```

### 2. When Ready for Production Updates
```bash
# Switch to main branch
git checkout main

# Merge only the changes you want in production
git merge development

# Push to main (triggers Vercel deployment)
git push origin main
```

### 3. Keep Production in Waitlist Mode
The production version will always show the waitlist because:
- Vercel uses `.env.production` values
- `VITE_ENABLE_WAITLIST=true` is set in production
- App.tsx conditionally renders based on this variable

### 4. Testing Modes Locally

**Test Waitlist Mode:**
```bash
# Temporarily change .env.local
VITE_ENABLE_WAITLIST=true

# Or build production version
npm run build
npm run preview
```

**Test Development Mode:**
```bash
# Default .env.local settings
npm run dev
```

## Vercel Configuration

### Current Setup
- **Production Branch**: `main` only
- **Preview Deployments**: Disabled for other branches
- **Environment Variables in Vercel Dashboard**:
  ```
  VITE_API_URL=https://api.feelyourvybe.com
  VITE_ENABLE_WAITLIST=true
  VITE_APP_MODE=waitlist
  ```

### How It Works
1. Vercel only deploys from `main` branch
2. Production environment variables override local ones
3. Users always see waitlist mode in production
4. You see full app mode in development

## File Changes Made

### `frontend/src/App.tsx`
- Added conditional routing based on environment variables
- Waitlist mode: Shows only waitlist and essential pages
- Development mode: Shows all pages including login, dashboard, etc.

### `frontend/vercel.json`
- Added git deployment configuration
- Restricts auto-deployment to `main` branch only

### Environment Files
- `.env.production`: Production settings (waitlist mode)
- `.env.local`: Development settings (full app mode)

## Deployment Strategy

### Option 1: Branch-Based (Current Setup) ✅ Recommended
- Production: `main` branch → Vercel → Waitlist mode
- Development: `development` branch → Local only → Full app mode

### Option 2: Manual Deployment Control
If you want more control, you can:
1. Disable auto-deployment in Vercel
2. Manually deploy when ready
3. Use Vercel CLI for specific deployments

### Option 3: Separate Vercel Projects
- Create two Vercel projects:
  - `vybe-production`: Connected to `main` branch
  - `vybe-staging`: Connected to `development` branch

## Quick Commands

```bash
# Switch to development mode
git checkout development

# Work on new features
# (login, dashboard, user management, etc.)

# Commit your work
git add .
git commit -m "feat: add user dashboard"
git push origin development

# When ready to update production (but keep waitlist)
git checkout main
git merge development  # or cherry-pick specific commits
git push origin main   # This updates production but keeps waitlist mode

# Go back to development
git checkout development
```

## Benefits

1. **Continuous Development**: You can work on new features without affecting production
2. **Production Stability**: Users always see the waitlist page
3. **Version Control**: Full history of all changes
4. **Easy Testing**: Switch between modes locally
5. **Flexible Deployment**: Choose when to update production

## Next Steps

1. Continue developing on the `development` branch
2. Build your login system, dashboard, user management, etc.
3. Test everything locally in development mode
4. When you're ready to launch the full app:
   - Change production environment variables
   - Or merge and update the main branch
   - Users will see the full app instead of waitlist

## Troubleshooting

**Q: I see the waitlist locally but want to see the full app**
A: Check your `.env.local` file has `VITE_ENABLE_WAITLIST=false`

**Q: Production is showing the full app instead of waitlist**
A: Check Vercel environment variables have `VITE_ENABLE_WAITLIST=true`

**Q: Changes aren't appearing on production**
A: Make sure you're pushing to the `main` branch, not `development`

**Q: I want to test production mode locally**
A: Run `npm run build && npm run preview` or temporarily change your `.env.local`
