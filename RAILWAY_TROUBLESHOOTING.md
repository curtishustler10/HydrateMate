# 🔧 Railway Deployment Troubleshooting

## Issue: Build Failed with "npm run build" Exit Code 127

### Root Cause
Railway was trying to build the React frontend as part of the backend deployment, but the frontend should be deployed separately to Vercel.

### Solution Applied
✅ **Fixed Configuration Files:**

1. **Updated `nixpacks.toml`** - Removed frontend build steps
2. **Added `.railwayignore`** - Excluded client directory
3. **Updated `railway.json`** - Backend-only deployment
4. **Cleaned `package.json`** - Removed conflicting build scripts

### Current Configuration

**Backend-Only Deployment:**
```toml
# nixpacks.toml
[phases.setup]
nixPkgs = ['nodejs-18_x']

[phases.install]  
cmds = ['cd server && npm install --only=production']

[start]
cmd = 'cd server && npm start'
```

**Files Ignored by Railway:**
```
# .railwayignore
client/
client/**/*
```

## Alternative Deployment Methods

### Method 1: Manual Railway CLI (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and create project
railway login
railway new

# Deploy only the server directory
cd server
railway up
```

### Method 2: Railway Dashboard with Root Directory
1. Go to Railway Dashboard
2. Settings → Deploy → Root Directory: `server`
3. This tells Railway to treat `server/` as the project root

### Method 3: Separate Repository (Cleanest)
Create two repositories:
- `hydratemate-backend` (server code only)
- `hydratemate-frontend` (client code only)

## Environment Variables for Railway

Set these in Railway Dashboard → Variables:

**Required:**
```
NODE_ENV=production
JWT_SECRET=your_super_secure_secret_key_here
```

**Database:**
```
DATABASE_URL=(auto-injected by Railway PostgreSQL)
```

**CORS & Security:**
```
CLIENT_URL=https://your-vercel-app.vercel.app
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

**Feature Flags:**
```
ENABLE_CHALLENGES=true
ENABLE_NOTIFICATIONS=false
ENABLE_ANALYTICS=true
```

## Testing Your Deployment

### 1. Check Build Logs
- Go to Railway Dashboard
- Click on your service
- View "Deployments" tab for build logs

### 2. Test Health Endpoint
```bash
curl https://your-app-name.up.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3. Test Database Migration
Check Railway logs for migration success:
```
🚀 Starting database migration...
✅ Database migration completed successfully!
```

## Common Railway Issues & Fixes

### Issue: Database Connection Failed
```bash
# Check if PostgreSQL service is running
# In Railway Dashboard: Services → PostgreSQL → Check status
```

**Fix:** Ensure PostgreSQL service is deployed and `DATABASE_URL` is injected.

### Issue: Port Binding Error
```
Error: listen EADDRINUSE :::5000
```

**Fix:** Railway injects `$PORT`, ensure server uses it:
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Issue: Module Not Found
```
Cannot find module 'express'
```

**Fix:** Ensure all dependencies are in `server/package.json`:
```bash
cd server
npm install --save express cors helmet
```

### Issue: Migration Fails
```
❌ Migration failed: connection timeout
```

**Fix:** Run migration manually:
```bash
railway run --service=backend npm run migrate
```

## Step-by-Step Deployment (Current Setup)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Fix Railway deployment configuration"
   git push origin main
   ```

2. **Create Railway Project:**
   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub
   - Select your repository

3. **Add PostgreSQL:**
   - Add Service → Database → PostgreSQL

4. **Set Environment Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=HydrateMate_Secure_Secret_2024
   ENABLE_CHALLENGES=true
   ```

5. **Deploy:**
   Railway will auto-deploy from your main branch

6. **Check Status:**
   Visit: `https://your-app.up.railway.app/health`

## Alternative: Simpler Monorepo Approach

If you want to keep everything in one repo but separate deployments:

**For Railway (Backend):**
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

**For Vercel (Frontend):**  
- Root Directory: `client`
- Framework: Create React App
- Build Command: `npm run build`

Your deployment should now work correctly! The key was separating backend and frontend concerns. 🚀