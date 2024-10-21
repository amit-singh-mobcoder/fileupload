import {Request, Response, NextFunction} from 'express'
import { ApiError } from '../utils/api-error'
import { configDotenv } from 'dotenv';
import { HttpStatusCodes } from '../utils/http-status-codes';
configDotenv()

const errorHandler = (err: ApiError | Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        });
    } else {
        console.error(err)
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error',
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        });     
    }
};

export default errorHandler;