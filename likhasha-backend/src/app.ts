import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { errorHandler } from './infrastructure/http/middlewares/error.middleware';
import { env } from './config/env.config';

interface RequestWithId extends Request {
  id?: string;
}

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowedOrigins = env.NODE_ENV === 'production'
      ? ['https://likhasha.com', 'https://www.likhasha.com', 'https://likhasha.wtf', 'https://www.likhasha.wtf']
      : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000', 'http://localhost:8081'];
    const isLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
    const isVercel = origin.endsWith('.vercel.app');
    const isAllowed = env.NODE_ENV !== 'production' ? (isLocalhost || isVercel || allowedOrigins.includes(origin)) : (allowedOrigins.includes(origin) || isVercel);
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Performance Middlewares
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request ID middleware for tracing
app.use((req: RequestWithId, _res: Response, next: NextFunction) => {
  req.id = req.headers['x-request-id'] as string || uuidv4();
  next();
});

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});
app.use('/api', globalLimiter);

// Stricter rate limit for AI generation endpoint — exported so routes.ts can apply it inline
export const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many generation requests. Please wait a moment.' },
});

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount all API routes
import routes from './infrastructure/http/routes';
app.use('/api', routes);

// Centralized Error Handling
app.use(errorHandler);

export default app;
