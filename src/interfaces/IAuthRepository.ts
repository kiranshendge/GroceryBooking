import { User } from "../entities/user";

export interface IAuthRepository {
    signUp(email: string, password: string, name: string) : Promise<User>;
    findUser(criteria: string, value: any) : Promise<User | null>;
    create(cart: any): Promise<any>;
    delete(id: number): Promise<any>;
    update(id: number, quantity: number): Promise<any>;
    findCart(userId: number): Promise<any>;
    createOrder(order: any): Promise<any>;
    listOrders(userId: number): Promise<any>;
    cancelOrder(id: number): Promise<any>;
    listAllOrders(orderStatus: string, limit: number, offset: number): Promise<any>;
    changeStatus(id: number, status: any): Promise<any>;
    getOrderById(id: number): Promise<any>;
}