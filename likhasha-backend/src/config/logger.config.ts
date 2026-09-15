import winston from 'winston';
import { env } from './env.config';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: env.NODE_ENV === 'production' ? logFormat : winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});
