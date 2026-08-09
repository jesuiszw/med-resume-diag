import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import analysisRouter from './routes/analysis';
import smsRouter from './routes/sms';
import authRouter from './routes/auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration — allow all origins in production, localhost in dev
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'med-resume-diag',
    timestamp: new Date().toISOString(),
  });
});

// Mount analysis routes
app.use('/api', analysisRouter);

// Mount SMS routes
app.use('/api', smsRouter);

// Mount auth routes
app.use('/api', authRouter);

// Serve frontend static files (production)
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  // SPA fallback: send index.html for all non-API GET requests
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('[Server Error]', err.message);
    console.error(err.stack);
    res.status(500).json({
      error: '服务器内部错误',
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`[Med Resume Diag] Server running on http://localhost:${PORT}`);
  console.log('[Med Resume Diag] Rule engine mode — no API key required.');
});

export default app;
