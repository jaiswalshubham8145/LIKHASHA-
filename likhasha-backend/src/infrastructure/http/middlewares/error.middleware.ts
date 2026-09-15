import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../domain/errors';
import { logger } from '../../../config/logger.config';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Invalid request payload',
      details: err.errors,
    });
    return;
  }

  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error('Non-operational error', { err });
    } else {
      logger.warn(`Operational error: ${err.message}`, { code: err.code });
    }

    res.status(err.statusCode).json({
      success: false,
      error: err.code,
      message: err.message,
    });
    return;
  }

  // Unhandled errors
  logger.error('Unhandled error', { err, stack: err.stack, path: req.path });
  
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message,
  });
};
