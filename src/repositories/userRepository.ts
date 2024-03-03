import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../entities/user';
import { injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { NotFoundError, ValidationError, STATUS_CODES } from '../exceptions/app_error';
import { Product } from '../entities/product';

@injectable()
export class UserRepository implements IUserRepository {
    private prismaClient: PrismaClient;
    constructor() {
        this.prismaClient = new PrismaClient();
    }
        
    async signUp(email: string, password: string, name: string, role: any): Promise<User> {
        let user = await this.findUser('email', email);
        if(user) {
            throw new ValidationError('User Already Exists', STATUS_CODES.BAD_REQUEST);
        }

        user = await this.prismaClient.user.create({
            data: {
                name,
                email, 
                password, 
                role
            }
        });

        return user;
    }

    async findUser(criteria: any, value: any): Promise<any> {
        try {
            let user: any;
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
        catch (err: any) {
            throw new NotFoundError('User not found', STATUS_CODES.NOT_FOUND);
        }
    }

    async create(input: any): Promise<any> {
        let product: Product;
        product = await this.prismaClient.product.findFirstOrThrow({
            where: {
                id: input.productId
            }
        })

        if (!product) {
            throw new NotFoundError('Product not found', STATUS_CODES.NOT_FOUND);
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
        try {
            await this.prismaClient.cartItem.delete({
                where: {
                    id
                }
            });
    
            return { success: true}
        }
        catch (err: any) {
            throw new NotFoundError('Item in cart not found', STATUS_CODES.NOT_FOUND);
        }
    }

    async update(id: number, quantity: number): Promise<any> {
        try {
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
        catch (err: any) {
            throw new NotFoundError('item in cart not found', STATUS_CODES.NOT_FOUND);
        }
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
            // find the items in cart
            const cartItems = await tx.cartItem.findMany({
                where: {
                    userId: orderReq.userId
                },
                include: {
                    product: true
                }
            });

            // if cart is empty, then show the message
            if(cartItems.length === 0) {
                return {message :("Cart is empty")};
            }

            // calculate total price base on product quantity
            const price = cartItems.reduce((prev, current) => {
                return prev + (current.quantity * +current.product.price)
            }, 0);

            // create order
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

            // Add event in order event table
            const orderEvent = await tx.orderEvent.create({
                data: {
                    orderId: order.id
                }
            });

            // update product inventory in product table
            cartItems.map(async (cart) => {
                await tx.product.update({
                    where: {
                        id: cart.productId
                    },
                    data: {
                        quantity: { decrement: cart.quantity}
                    }
                })
            })

            // empty the cart
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
        try {
            return await this.prismaClient.$transaction( async (tx) => {
                // update order status as "CANCELLED"
                const order = await tx.order.update({
                    where: {
                        id
                    },
                    data: {
                        status: "CANCELLED"
                    }
                });
    
                // Add CANCELLED event 
                await tx.orderEvent.create({
                    data: {
                        status: "CANCELLED",
                        orderId: order.id
                    }
                });
                return order;
            });
        } catch (err: any) {
            throw new NotFoundError('Order not found', STATUS_CODES.NOT_FOUND);
        }
        
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
        try {
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
        } catch (err: any) {
            throw new NotFoundError('Order not found', STATUS_CODES.NOT_FOUND);
        }
        
    }

    async getOrderById(id: number): Promise<any> {
        try {
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
        } catch (err: any) {
            throw new NotFoundError('Order not found', STATUS_CODES.NOT_FOUND);
        }       
    }
}