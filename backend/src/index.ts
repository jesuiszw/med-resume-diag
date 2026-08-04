import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import analysisRouter from './routes/analysis';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration — allow localhost in dev, all origins in production
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? true
    : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
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

// ─── Serve frontend static files in production ───
// The built React app lives in frontend/dist (relative to repo root).
// In compiled JS, __dirname = backend/dist, so ../../frontend/dist points to the right place.
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));
  // SPA fallback: any non-API GET request serves index.html
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
});

export default app;
