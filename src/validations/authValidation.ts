import Joi from "joi";

export const registerSchema = Joi.object({
    fname: Joi.string().required().messages({
        "string.base":"First name must be string.",
        "string.empty":"First name cannot be empty.",
        "any.required":"First name is required."
    }),
    lname: Joi.string().required().messages({
        "string.base":"Last name must be string.",
        "string.empty":"Last name cannot be empty.",
        "any.required":"Last name is required."
    }),
    email: Joi.string().email().required().messages({
        "string.base":"Email must be string.",
        "string.empty":"Email cannot be empty.",
        "any.required":"Email is required."

    }),
    password: Joi.string().min(8).max(20).required().messages({
        "string.empty":"Password cannot be empty.",
        "string.min": "Password must be at least 8 characters long.",
        "string.max": "Password must be at most 20 characters long.",
        "any.required":"Password is required."
    }),
})


export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required."
    }),
    password: Joi.string().required().messages({"string.empty": "Password is required."})
})