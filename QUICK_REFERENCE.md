# Quick Reference: Development vs Production

## Current Setup ✅

### Production (Live on Vercel)
- **Branch**: `main` 
- **URL**: https://feelyourvybe.com
- **Mode**: Waitlist only
- **Users see**: Waitlist page
- **Auto-deploys**: Yes, from `main` branch only

### Development (Local)
- **Branch**: `development`
- **URL**: http://localhost:8080
- **Mode**: Full app (login, dashboard, etc.)
- **You see**: Complete application
- **Auto-deploys**: No

## Quick Commands

```powershell
# Use the helper script
.\dev-helper.ps1 status          # Check current setup
.\dev-helper.ps1 dev-start       # Start development (full app)
.\dev-helper.ps1 dev-waitlist    # Start development (waitlist mode)
.\dev-helper.ps1 commit "message" # Quick commit and push
```

```bash
# Or use git directly
git checkout development         # Switch to development
npm run dev                     # Start full app mode
npm run dev:waitlist           # Start waitlist mode

# When ready to push changes
git add .
git commit -m "feat: add login page"
git push origin development
```

## Key Files

- `frontend/src/App.tsx` - Main app with conditional routing
- `frontend/.env.local` - Development environment (full app)
- `frontend/.env.production` - Production environment (waitlist)
- `frontend/vercel.json` - Vercel deployment config

## Environment Variables

| Variable | Development | Production |
|----------|-------------|------------|
| `VITE_ENABLE_WAITLIST` | `false` | `true` |
| `VITE_APP_MODE` | `development` | `waitlist` |
| `VITE_API_URL` | `localhost:3001` | `api.feelyourvybe.com` |

## Workflow

1. **Daily Development**
   ```bash
   git checkout development
   # Work on features (login, dashboard, etc.)
   git commit -m "feat: new feature"
   git push origin development
   ```

2. **Update Production (Keep Waitlist)**
   ```bash
   git checkout main
   git merge development
   git push origin main  # Triggers Vercel deployment
   git checkout development
   ```

3. **Launch Full App (When Ready)**
   - Update Vercel environment variables
   - Set `VITE_ENABLE_WAITLIST=false` in production
   - Or merge code that changes the default behavior

## Troubleshooting

**Problem**: Seeing waitlist locally when you want full app
**Solution**: Check `frontend/.env.local` has `VITE_ENABLE_WAITLIST=false`

**Problem**: Production showing full app instead of waitlist  
**Solution**: Check Vercel environment variables

**Problem**: Changes not appearing on live site
**Solution**: Make sure you pushed to `main` branch, not `development`
