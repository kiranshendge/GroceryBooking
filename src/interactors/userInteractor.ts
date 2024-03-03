import { inject, injectable } from "inversify";
import { IUserInteractor } from "../interfaces/IUserInteractor";
import { IUserRepository } from "../interfaces/IUserRepository";
import { INTERFACE_TYPE } from "../utils";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secret';
import { NotFoundError, ValidationError } from '../exceptions/app_error';
import { User } from "../entities/user";

@injectable()
export class UserInteractor implements IUserInteractor {
    private authRepository : IUserRepository;

    constructor(@inject (INTERFACE_TYPE.AuthRepository) repository: IUserRepository) {
        this.authRepository = repository;
    }
        
    async signUp(email: string, password: string, name: string, role: any): Promise<User> {
        password = hashSync(password, 10);
        const data = await this.authRepository.signUp(email, password, name, role);
        return data;
    }
    
    async login(input: any): Promise<any> {
        const { email, password } = input;
        let existingCustomer: any = await this.findUser('email', email);

        if(!existingCustomer) {
            throw new NotFoundError('User not found with provided email id');
        }

        if(!compareSync(password, existingCustomer.password)) {
            throw new ValidationError('incorrect password');
        }

        const token = jwt.sign({
            userId: existingCustomer.id
        }, JWT_SECRET);

        return {existingCustomer, token};
    }

    async findUser(criteria: string, value: any): Promise<any> {
        const data = await this.authRepository.findUser(criteria, value);
        return data;
    }

    async addItemToCart(cart: any): Promise<any> {
        return await this.authRepository.create(cart);
    }

    async deleteItemFromCart(id: number): Promise<any> {
        return await this.authRepository.delete(id);
    }

    async updateQuantity(id: number, quantity: number): Promise<any> {
        return await this.authRepository.update(id, quantity);
    }

    async getCart(userId: number): Promise<any> {
        return await this.authRepository.findCart(userId);
    }

    async createOrder(orderReq: any): Promise<any> {
        return await this.authRepository.createOrder(orderReq);
    }

    async listOrders(userId: number): Promise<any> {
        return await this.authRepository.listOrders(userId);
    }

    async cancelOrder(id: number): Promise<any> {
        return await this.authRepository.cancelOrder(id);
    }
    async listAllOrders(orderStatus: string, limit: number, offset: number): Promise<any> {
        return await this.authRepository.listAllOrders(orderStatus, limit, offset);
    }
    async changeStatus(id: number, status: any): Promise<any> {
        return await this.authRepository.changeStatus(id, status);
    }
    async getOrderById(id: number): Promise<any> {
        return await this.authRepository.getOrderById(id);
    }
}