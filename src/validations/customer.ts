import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../exceptions/app_error";

const signUpValidationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.any().required()
});

const loginValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})

export const signUpSchema = (req: Request, res: Response, next: NextFunction) => {
    const isValid = signUpValidationSchema.validate(req.body);
    return validateSchema(req, res, next, isValid);
}
export const loginSchema = (req: Request, res: Response, next: NextFunction) => {
    const isValid = loginValidationSchema.validate(req.body);
    return validateSchema(req, res, next, isValid);
}

const validateSchema = (req: Request, res: Response, next: NextFunction, isValid: Joi.ValidationResult<any>) => {
    if (isValid.error) {
        return res.status(STATUS_CODES.BAD_REQUEST).send({code: 400, message: isValid.error.details[0].message})
    }
    return next();
}