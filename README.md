# 💧 HydrateMate

**Tagline:** *Sip smarter. Hydrate happier.*

A super-lightweight SaaS platform that helps users build healthy hydration habits through timely, engaging reminders and goal tracking.

## 🎯 Core Features

- **Smart Reminders**: Randomized push notifications (30-90 min intervals)
- **Goal Tracking**: Daily intake monitoring with visual progress
- **Quick Logging**: One-tap water intake buttons (250ml, 500ml, 750ml)
- **Streak Tracking**: Gamified consistency rewards
- **Personalized Goals**: Weight-based hydration recommendations

## 🏗️ Tech Stack

- **Frontend**: React 18, TailwindCSS, React Query
- **Backend**: Node.js, Express, PostgreSQL
- **Deployment**: (TBD - Vercel + Railway/Heroku recommended)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- PostgreSQL 12+
- npm/yarn

### Installation

```bash
# Clone and install dependencies
git clone <repository-url>
cd hydratemate
npm run install-deps

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
cd server && npm run migrate

# Start development servers
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
hydratemate/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   └── services/       # API calls
├── server/                 # Express backend
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   ├── middleware/         # Custom middleware
│   └── scripts/            # Database migrations
└── README.md
```

## 🗄️ Database Schema

### Users Table
- `id` (PRIMARY KEY)
- `weight`, `weight_unit` 
- `daily_goal` (ml)
- `reminder_start`, `reminder_end` (TIME)
- `created_at`, `updated_at`

### Hydration Logs Table
- `id` (PRIMARY KEY)
- `user_id` (FOREIGN KEY)
- `amount` (ml)
- `logged_at` (TIMESTAMP)

## 🔌 API Endpoints

### Users
- `POST /api/users/profile` - Create user profile
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/:id` - Update user profile

### Hydration
- `POST /api/hydration/log` - Log water intake
- `GET /api/hydration/daily/:userId/:date?` - Get daily intake
- `GET /api/hydration/weekly/:userId` - Get weekly stats
- `GET /api/hydration/streak/:userId` - Get streak count

## 🎨 UI Pages

1. **Dashboard** - Progress circle, quick-log buttons, daily stats
2. **Onboarding** - 3-step setup (weight → goal → reminders)
3. **Settings** - Profile, notifications, appearance preferences

## 📱 Target Users

- **Busy Professionals** - Desk workers who forget to hydrate
- **Fitness Enthusiasts** - Athletes optimizing recovery
- **Health Seekers** - General wellness audience

## 🔮 Future Enhancements

- Push notification service integration
- Apple Health / Google Fit sync
- Advanced analytics dashboard
- Social features & challenges
- Smart ML-based reminder timing

## 📄 License

MIT License - see LICENSE file for details.