import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API health endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'EventEase API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API System summary endpoint
app.get('/api/summary', (_req, res) => {
  res.json({
    platform: 'EventEase – Smart Event Management System',
    version: '1.0.0',
    database: 'Firebase Cloud Firestore',
    auth: 'Firebase Authentication',
    modules: ['User Registration & Booking', 'Admin Dashboard & Event Management', 'Participant Directory']
  });
});

// Serve Vite build in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Only listen if run directly (e.g., node server.ts)
if (process.env.NODE_ENV === 'production' || process.argv[1] === __filename) {
  app.listen(PORT, () => {
    console.log(`EventEase server is running on http://localhost:${PORT}`);
  });
}

export default app;
