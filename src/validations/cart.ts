import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { STATUS_CODES } from '../exceptions/app_error';

const createCartValidationSchema = Joi.object({
    productId: Joi.number().required(),
    quantity: Joi.number().required()
})

const updateQuantityValidationSchema = Joi.object({
    quantity: Joi.number().required()
})

export const createCartSchema = (req: Request, res: Response, next: NextFunction) => {
    const isValid = createCartValidationSchema.validate(req.body);
    return validateSchema(req, res, next, isValid)
}

export const updateQuantitySchema = (req: Request, res: Response, next: NextFunction) => {
    const isValid = updateQuantityValidationSchema.validate(req.body);
    return validateSchema(req, res, next, isValid)
}

const validateSchema = (req: Request, res: Response, next: NextFunction, isValid: Joi.ValidationResult<any>) => {
    if (isValid.error) {
        return res.status(STATUS_CODES.BAD_REQUEST).send({code: 400, message: isValid.error.details[0].message})
    }
    return next();
}