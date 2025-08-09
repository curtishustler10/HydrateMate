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
console.log(`📁 Attempting to serve static files from: ${buildPath}`);
console.log(`📂 Current working directory: ${process.cwd()}`);
console.log(`📂 __dirname: ${__dirname}`);

// Check if build directory exists
const fs = require('fs');
if (fs.existsSync(buildPath)) {
  console.log(`✅ Build directory found at: ${buildPath}`);
  app.use(express.static(buildPath));
} else {
  console.log(`❌ Build directory not found at: ${buildPath}`);
  // Try alternative path (in case we're running from root)
  const altBuildPath = path.join(process.cwd(), 'client', 'build');
  console.log(`🔍 Trying alternative path: ${altBuildPath}`);
  if (fs.existsSync(altBuildPath)) {
    console.log(`✅ Build directory found at alternative path: ${altBuildPath}`);
    app.use(express.static(altBuildPath));
  } else {
    console.log(`❌ Build directory not found at alternative path either`);
  }
}

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
  // Determine correct build path
  let correctBuildPath = buildPath;
  const altBuildPath = path.join(process.cwd(), 'client', 'build');
  
  if (!fs.existsSync(buildPath) && fs.existsSync(altBuildPath)) {
    correctBuildPath = altBuildPath;
  }
  
  const indexPath = path.join(correctBuildPath, 'index.html');
  console.log(`📄 Attempting to serve React app from: ${indexPath}`);
  
  // Check if build directory and index.html exist
  if (!fs.existsSync(correctBuildPath)) {
    console.error(`❌ Build directory not found: ${correctBuildPath}`);
    return res.status(404).send('Build directory not found');
  }
  
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ index.html not found: ${indexPath}`);
    return res.status(404).send('index.html not found');
  }
  
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