import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        
        let statusColor: string;
        if (res.statusCode >= 200 && res.statusCode < 300) {
            statusColor = '\x1b[32m'; // Green
        } else if (res.statusCode >= 400 && res.statusCode < 500) {
            statusColor = '\x1b[33m'; // Yellow
        } else if (res.statusCode >= 500) {
            statusColor = '\x1b[31m'; // Red
        } else {
            statusColor = '\x1b[0m'; 
        }

        // Reset color after the status code
        const resetColor = '\x1b[0m'; 

        logger.info(`${req.method} ${req.url} - ${statusColor}${res.statusCode}${resetColor} [${duration}ms]`);
    });

    next();
};

export default loggerMiddleware;
