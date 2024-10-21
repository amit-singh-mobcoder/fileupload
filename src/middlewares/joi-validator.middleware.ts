import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { HttpStatusCodes } from "../utils/http-status-codes";

export const validate = (schema: Joi.Schema) => {
    return (req: Request, res: Response, next:NextFunction) => {
        const { error } = schema.validate(req.body, {abortEarly: false})

        if(error) {
            const errors = error.details.map((detail) => detail.message);
            throw new ApiError(HttpStatusCodes.BAD_REQUEST, "Validation failed", errors)
        }

        next();
    }
}