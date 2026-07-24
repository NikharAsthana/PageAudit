import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import auditRoutes from './routes/auditRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: ALLOWED_ORIGINS.length ? ALLOWED_ORIGINS : '*',
  })
);
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', auditRoutes);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found.' } });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`PageAudit API listening on http://localhost:${PORT}`);
});