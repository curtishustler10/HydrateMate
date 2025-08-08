const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const userRoutes = require('./routes/users');
const hydrationRoutes = require('./routes/hydration');
const challengeRoutes = require('./routes/challenges');
const db = require('./models/database');
const startup = require('./scripts/startup');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting HydrateMate Server...');
console.log(`📊 Environment: ${process.env.NODE_ENV}`);
console.log(`🌍 Port: ${PORT}`);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [
    'http://localhost:3000',
    'https://hydratemate.vercel.app',
    'https://hydrate-mate.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Rate limiting with configurable limits
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ 
  limit: process.env.MAX_REQUEST_SIZE || '10mb',
  type: 'application/json'
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint with database connectivity
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await db.query('SELECT 1');
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || 'v1',
      environment: process.env.NODE_ENV,
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Database connection failed'
    });
  }
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    api: 'HydrateMate API',
    version: process.env.API_VERSION || 'v1',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    features: {
      challenges: process.env.ENABLE_CHALLENGES === 'true',
      notifications: process.env.ENABLE_NOTIFICATIONS === 'true',
      analytics: process.env.ENABLE_ANALYTICS === 'true'
    }
  });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/hydration', hydrationRoutes);

// Conditionally enable challenge routes
if (process.env.ENABLE_CHALLENGES === 'true') {
  app.use('/api/challenges', challengeRoutes);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({ 
    success: false,
    error: {
      message: isDevelopment ? err.message : 'Internal server error',
      code: err.code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      ...(isDevelopment && { stack: err.stack })
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND',
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    }
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM signal received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT signal received. Shutting down gracefully...');
  process.exit(0);
});

// Start server with database initialization
const startServer = async () => {
  // Run startup checks and migrations
  const { databaseReady, migrationComplete } = await startup();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log('✅ HydrateMate API Server started successfully!');
    console.log(`🌐 Server running on http://0.0.0.0:${PORT}`);
    console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`);
    console.log(`📡 API status: http://0.0.0.0:${PORT}/api/status`);
    console.log(`📦 Database: ${databaseReady ? 'Connected' : 'Not available'}`);
    console.log(`🗃️ Migration: ${migrationComplete ? 'Complete' : 'Skipped/Failed'}`);
  });
};

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});