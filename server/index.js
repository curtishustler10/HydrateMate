const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Deterministic build path (monorepo: /server + /client)
const buildPath = path.resolve(__dirname, '../client/build');
app.use(express.static(buildPath));

// API
app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
app.get('/api/status', (_req, res) => {
  res.json({ api: 'HydrateMate API', version: 'full-stack', ts: new Date().toISOString() });
});

// ✅ SPA fallback AFTER API routes
app.get('*', (req, res, next) => {
  const indexPath = path.join(buildPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    // Helpful runtime log while we sort CI
    console.error('index.html missing at:', indexPath);
    return res.status(500).send('Frontend build not found. Did the build run?');
  }
  res.sendFile(indexPath);
});

app.listen(PORT, () => console.log('✅ Full-stack server on', PORT));