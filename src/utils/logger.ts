import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack}) => {
  const formattedTimestamp = new Date(timestamp).toISOString().replace(/\.\d{3}Z$/, 'Z');
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create the logger
const logger = createLogger({
  level: 'info', // Minimum level of logs to capture
  format: combine(
    colorize(), // Colorize logs
    timestamp(), // Add timestamps to logs
    errors({ stack: true }), // Log errors with stack traces
    logFormat // Apply the custom format
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to file
    new transports.File({ filename: 'logs/combined.log' }) // Log all messages to a file
  ],
});

export default logger;
