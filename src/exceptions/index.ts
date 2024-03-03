import { Request, Response, NextFunction } from "express";
import { BaseError } from "./app_error";

const errorHandler = (app: any) => {
    app.use((error: BaseError, req: Request, res: Response, next: NextFunction) => {
        const statusCode = error.statusCode || 500;
        const data = error.message;
        return res.status(statusCode).json(data);
    })
};

export default errorHandler;