import { inject, injectable } from "inversify";
import { IAuthInteractor } from "../interfaces/IAuthInteractor";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import { INTERFACE_TYPE } from "../utils";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secret';

@injectable()
export class AuthInteractor implements IAuthInteractor {
    private authRepository : IAuthRepository;

    constructor(@inject (INTERFACE_TYPE.AuthRepository) repository: IAuthRepository) {
        this.authRepository = repository;
    }
        
    async signUp(email: string, password: string, name: string) {
        password = hashSync(password, 10);
        const data = await this.authRepository.signUp(email, password, name);
        return data;
    }
    
    async login(input: any) {
        const { email, password } = input;
        let user: any = await this.findUser('email', email);

        if(!user) {
            throw Error('User not found');
        }

        if(!compareSync(password, user.password)) {
            throw Error('incorrect password');
        }

        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET);

        return {user, token};
    }

    async findUser(criteria: string, value: any) {
        const data = await this.authRepository.findUser(criteria, value);
        return data;
    }

    async addItemToCart(cart: any) {
        return await this.authRepository.create(cart);
    }

    async deleteItemFromCart(id: number) {
        return await this.authRepository.delete(id);
    }

    async updateQuantity(id: number, quantity: number) {
        return await this.authRepository.update(id, quantity);
    }

    async getCart(userId: number) {
        return await this.authRepository.findCart(userId);
    }

    async createOrder(orderReq: any) {
        return await this.authRepository.createOrder(orderReq);
    }

    async listOrders(userId: number) {
        return await this.authRepository.listOrders(userId);
    }

    async cancelOrder(id: number) {
        return await this.authRepository.cancelOrder(id);
    }
    async listAllOrders(orderStatus: string, limit: number, offset: number) {
        return await this.authRepository.listAllOrders(orderStatus, limit, offset);
    }
    async changeStatus(id: number, status: any) {
        return await this.authRepository.changeStatus(id, status);
    }
    async getOrderById(id: number) {
        return await this.authRepository.getOrderById(id);
    }
}