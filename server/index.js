const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

console.log('🚀 HydrateMate Server starting...');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (deterministic path)
const buildPath = path.resolve(__dirname, '../client/build');
app.use(express.static(buildPath));

// API endpoints
app.get('/api/health', (_, res) => {
  res.json({
    status: 'healthy',
    ts: new Date().toISOString()
  });
});

app.get('/api/status', (_, res) => {
  res.json({
    api: 'HydrateMate',
    version: '1.0.0',
    env: process.env.NODE_ENV || 'development',
    ts: new Date().toISOString()
  });
});

// SPA fallback - serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});