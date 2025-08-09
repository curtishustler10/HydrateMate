# 🚀 HydrateMate Railway Deployment Guide

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Railway CLI** (optional): `npm install -g @railway/cli`

## Step-by-Step Deployment

### 1. Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account if not already connected
5. Select the `curtishustler10/HydrateMate` repository

### 2. Add PostgreSQL Database

1. In your Railway project dashboard, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL database
4. Note: The `DATABASE_URL` will be automatically injected into your app

### 3. Configure Environment Variables

In the Railway dashboard, go to your backend service and add these environment variables:

**Required Variables:**
\`\`\`bash
NODE_ENV=production
JWT_SECRET=HydrateMate_Super_Secure_JWT_Secret_Key_2024_Production_CHANGE_THIS
CLIENT_URL=https://your-frontend-domain.vercel.app
CORS_ORIGIN=https://your-frontend-domain.vercel.app
ENABLE_CHALLENGES=true
ENABLE_NOTIFICATIONS=false
ENABLE_ANALYTICS=true
\`\`\`

**Optional Variables:**
\`\`\`bash
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
BCRYPT_ROUNDS=12
LOG_LEVEL=info
\`\`\`

### 4. Deploy Backend

1. Railway will automatically deploy when you push to your main branch
2. Check the deployment logs in Railway dashboard
3. The migration script will run automatically on first deploy

### 5. Get Your API URL

1. In Railway dashboard, go to your backend service
2. Click on "Settings" → "Domains"
3. Copy your Railway app URL (e.g., `https://hydratemate-production.up.railway.app`)
4. Test the health check: `https://your-app-url.railway.app/health`

## Manual Railway CLI Deployment

If you prefer using the CLI:

\`\`\`bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway new

# Link to existing project (if already created)
railway link

# Add PostgreSQL database
railway add --database postgresql

# Set environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_secure_secret
railway variables set CLIENT_URL=https://your-frontend.vercel.app

# Deploy
railway up
\`\`\`

## Database Migration

The database migration will run automatically on deployment via the `Procfile`:

\`\`\`
web: cd server && npm start
release: cd server && npm run migrate
\`\`\`

To manually run migrations:
\`\`\`bash
railway run npm run migrate --prefix server
\`\`\`

## Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Import your GitHub repository
3. Configure build settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. Add environment variable:
   \`\`\`
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   \`\`\`

## Environment Variables Summary

### Backend (Railway)
| Variable | Value | Required |
|----------|--------|----------|
| `NODE_ENV` | `production` | ✅ |
| `JWT_SECRET` | Your secure 256-bit secret | ✅ |
| `CLIENT_URL` | Your Vercel frontend URL | ✅ |
| `CORS_ORIGIN` | Your allowed origins | ✅ |
| `DATABASE_URL` | Auto-injected by Railway | ✅ |
| `ENABLE_CHALLENGES` | `true` | ⚠️ |
| `ENABLE_NOTIFICATIONS` | `false` | ⚠️ |

### Frontend (Vercel)
| Variable | Value | Required |
|----------|--------|----------|
| `REACT_APP_API_URL` | Your Railway backend URL + `/api` | ✅ |

## Testing Your Deployment

### 1. Health Check
\`\`\`bash
curl https://your-app-url.railway.app/health
\`\`\`

Expected response:
\`\`\`json
{
  "status": "healthy",
  "database": "connected",
  "version": "v1",
  "environment": "production"
}
\`\`\`

### 2. API Status
\`\`\`bash
curl https://your-app-url.railway.app/api/status
\`\`\`

### 3. Create Test User
\`\`\`bash
curl -X POST https://your-app-url.railway.app/api/users/profile \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 70,
    "unit": "kg",
    "dailyGoal": 2000,
    "reminderStart": "08:00",
    "reminderEnd": "22:00"
  }'
\`\`\`

## Monitoring & Logs

### View Logs
\`\`\`bash
railway logs
\`\`\`

### Monitor Performance
- Railway provides built-in metrics
- Check CPU/Memory usage in dashboard
- Monitor response times and error rates

## Scaling Configuration

For production scaling, update your Railway service:

1. **CPU & Memory**: Adjust in Railway dashboard
2. **Database**: Scale PostgreSQL as needed
3. **Regions**: Deploy to multiple regions for lower latency

## Cost Estimation

### Starter Plan (~$15-25/month)
- Railway Starter: $5/month
- PostgreSQL: $5/month
- Additional compute: $5-15/month based on usage

### Growth Plan (~$50-100/month)
- Railway Pro: $20/month
- PostgreSQL Pro: $15/month
- Additional services: $15-65/month

## Troubleshooting

### Common Issues

1. **Migration Fails**
   \`\`\`bash
   railway run npm run migrate --prefix server
   \`\`\`

2. **CORS Errors**
   - Check `CORS_ORIGIN` environment variable
   - Ensure frontend URL is included

3. **Database Connection Issues**
   - Verify PostgreSQL service is running
   - Check `DATABASE_URL` is automatically set

4. **Build Failures**
   - Check build logs in Railway dashboard
   - Verify all dependencies are in `package.json`

### Support

- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Railway Docs: [docs.railway.app](https://docs.railway.app)
- GitHub Issues: Create issues in your repository

## Next Steps After Deployment

1. **Domain Setup**: Configure custom domain in Railway
2. **SSL Certificate**: Railway provides automatic HTTPS
3. **Monitoring**: Set up error tracking (Sentry)
4. **Backup**: Configure automated database backups
5. **CI/CD**: Set up automated deployments from GitHub

Your HydrateMate API is now ready for production! 🎉
