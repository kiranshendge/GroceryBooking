import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secret";
import { AuthInteractor } from "../interactors/authInteractor";
import { AuthRepository } from "../repositories/authRepository";

const authMiddleware =  async (req: any, resp: Response, next: NextFunction) => {
    const repository = new AuthRepository();
    const authInteractor = new AuthInteractor(repository);
    const token: any = req.headers.authorization;
    if (!token) {
        next( Error('unauthorized'));
    }
     try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        const user = authInteractor.findUser('id', payload.userId);
        if(!user) {
            next( Error('unauthorized'));
        }
        req.user = user;
        next();
     }
     catch (error) {
        next(error);
     }
}

export default authMiddleware;