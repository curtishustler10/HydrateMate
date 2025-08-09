const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting Full-Stack HydrateMate Server...');
console.log(`📊 Environment: ${process.env.NODE_ENV}`);
console.log(`🌍 Port: ${PORT}`);

// Basic middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
const buildPath = path.join(__dirname, '..', 'client', 'build');
console.log(`📁 Serving static files from: ${buildPath}`);
app.use(express.static(buildPath));

// API endpoints (all under /api prefix)
app.get('/api', (req, res) => {
  res.json({
    message: 'HydrateMate API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/ping', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: 'running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'checking...'
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    api: 'HydrateMate API',
    version: 'full-stack',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handling for API routes
app.use('/api/*', (err, req, res, next) => {
  console.error('API Error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Serve React App for all non-API routes (SPA routing)
app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  console.log(`📄 Serving React app: ${indexPath}`);
  res.sendFile(indexPath);
});

// Start server - let Railway handle the host binding
app.listen(PORT, () => {
  console.log('✅ Full-Stack HydrateMate Server started successfully!');
  console.log(`🌐 Server running on port ${PORT}`);
  console.log('🔥 Ready for Railway traffic!');
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});