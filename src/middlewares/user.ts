import { NextFunction, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secret";
import { UserInteractor } from "../interactors/userInteractor";
import { UserRepository } from "../repositories/userRepository";
import { AuthorizeError } from "../exceptions/app_error";

const userMiddleware =  async (req: any, resp: Response, next: NextFunction) => {
    const repository = new UserRepository();
    const authInteractor = new UserInteractor(repository);
    const token: any = req.headers.authorization;
    if (!token) {
        next( new AuthorizeError('Unauthorized'));
    }
     try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        const user = await authInteractor.findUser('id', payload.userId);
        if(!user) {
            next( new AuthorizeError('Unauthorized'));
        }
        req.user = user;
        delete req.user?.password;
        next();
     }
     catch (error) {
        next( new AuthorizeError('Unauthorized'));
     }
}

export default userMiddleware;