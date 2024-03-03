import { Request, Response, NextFunction } from "express";
import { AuthorizeError } from "../exceptions/app_error";

const adminMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user.role === 'ADMIN') {
        next();
    }
    else {
        next( new AuthorizeError('Unauthorized. This is not a admin user'))
    }
}

export default adminMiddleware;