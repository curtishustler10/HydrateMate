const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting Minimal HydrateMate Server...');
console.log(`📊 Environment: ${process.env.NODE_ENV}`);
console.log(`🌍 Port: ${PORT}`);

// Basic middleware
app.use(cors());
app.use(express.json());

// Basic endpoints
app.get('/', (req, res) => {
  res.json({
    message: 'HydrateMate API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/ping', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: 'running'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'checking...'
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    api: 'HydrateMate API',
    version: 'minimal',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Start server - let Railway handle the host binding
app.listen(PORT, () => {
  console.log('✅ Minimal HydrateMate Server started successfully!');
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