import { IAuthRepository } from '../interfaces/IAuthRepository';
import { User } from '../entities/user';
import { injectable } from 'inversify';
import { PrismaClient, Product } from '@prisma/client';

@injectable()
export class AuthRepository implements IAuthRepository {
    private prismaClient: PrismaClient;
    constructor() {
        this.prismaClient = new PrismaClient();
    }
        
    async signUp(email: string, password: string, name: string): Promise<User> {
        let user = await this.findUser('email', email);
        if(user) {
            throw Error('User Already Exists');
        }

        user = await this.prismaClient.user.create({
            data: {
                name,
                email, 
                password
            }
        });

        return user;
    }

    async findUser(criteria: any, value: any): Promise<User | null> {
        let user: User | null;
        if( criteria === 'email') {
            user = await this.prismaClient.user.findFirst({where: { email: value}});
        }
        else if (criteria === 'id') {
            user = await this.prismaClient.user.findFirst({where: { id: value}});
        }
        else {
            user = null
        }
        return user;
    }

    async create(input: any): Promise<any> {
        let product: Product;
        try {
            product = await this.prismaClient.product.findFirstOrThrow({
                where: {
                    id: input.productId
                }
            })
        }
        catch (error) {
            throw Error('Product not found');
        }

        const cart = await this.prismaClient.cartItem.create({
            data: {
                userId: input.userId,
                productId: product.id,
                quantity: input.quantity
            }
        })
        
        return cart;
    }
    async delete(id: number): Promise<any> {
        await this.prismaClient.cartItem.delete({
            where: {
                id
            }
        });

        return { success: true}
    }

    async update(id: number, quantity: number): Promise<any> {
        const updatedCart = await this.prismaClient.cartItem.update({
            where: {
                id
            },
            data: {
                quantity
            }
        });

        return updatedCart;
    }

    async findCart(userId: number): Promise<any> {
        const carts = await this.prismaClient.cartItem.findMany({
            where: {
                userId
            },
            include: {
                product: true
            }
        });

        return carts;
    }

    async createOrder(orderReq: any): Promise<any> {
        return await this.prismaClient.$transaction(async (tx) => {
            const cartItems = await tx.cartItem.findMany({
                where: {
                    userId: orderReq.userId
                },
                include: {
                    product: true
                }
            });

            if(cartItems.length === 0) {
                return {message :("Cart is empty")};
            }

            const price = cartItems.reduce((prev, current) => {
                return prev + (current.quantity * +current.product.price)
            }, 0);

            const order = await tx.order.create({
                data: {
                    userId: orderReq.userId,
                    netAmount: price,
                    products: {
                        create: cartItems.map((cart) => {
                            return {
                                productId: cart.productId,
                                quantity: cart.quantity
                            }
                        })
                    }
                }
            });

            const orderEvent = await tx.orderEvent.create({
                data: {
                    orderId: order.id
                }
            });

            await tx.cartItem.deleteMany({
                where: {
                    userId: orderReq.userId
                }
            });
            return order;
        });
    }
    async listOrders(userId: number): Promise<any> {
        return await this.prismaClient.order.findMany({
            where: {
                userId
            }
        })
    }
    async cancelOrder(id: number): Promise<any> {
        return await this.prismaClient.$transaction( async (tx) => {
            const order = await tx.order.update({
                where: {
                    id
                },
                data: {
                    status: "CANCELLED"
                }
            });

            await tx.orderEvent.create({
                data: {
                    status: "CANCELLED",
                    orderId: order.id
                }
            });
            return order;
        });
    }

    async listAllOrders(orderStatus: string, limit: number, offset: number): Promise<any> {
        let whereClause = {};
        const status = orderStatus;
        if (status) {
            whereClause = {
                status
            }
        }
        const orders = await this.prismaClient.order.findMany({
            where: whereClause,
            skip: offset,
            take: 5
        });
        return orders;
    }
    async changeStatus(id: number, status: any): Promise<any> {
        return await this.prismaClient.$transaction( async (tx) => {
            const order = await tx.order.update({
                where: {
                    id
                },
                data: {
                    status
                }
            });

            await tx.orderEvent.create({
                data: {
                    status,
                    orderId: order.id
                }
            });
            return order;
        });
    }

    async getOrderById(id: number): Promise<any> {
        const order = await this.prismaClient.order.findFirstOrThrow({
            where: {
                id
            },
            include: {
                products: true,
                events: true
            }
        });
        return order;
    }
}