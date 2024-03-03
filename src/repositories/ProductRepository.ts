
import { IProductRepository } from '../interfaces/IProductRepository';
import { Product } from '../entities/product';
import { injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../exceptions/app_error';

@injectable()
export class ProductRepository implements IProductRepository {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }
    
    async create(input: Product): Promise<Product> {
        const product = await this.prismaClient.product.create({
            data: {
                ...input
            }
        })
        return product;
    }

    async update(id: number, product: Product): Promise<Product> {
        try {
            const updatedProduct = await this.prismaClient.product.update({
                where : {
                    id: id
                },
                data: product
            });
            return updatedProduct;
        } catch (err: any) {
            throw new NotFoundError('Product not found');
        }
    }

    async find(limit: number, offset: number): Promise<any> {
        const count = await this.prismaClient.product.count();
        const products = await this.prismaClient.product.findMany({
            skip: offset,
            take: limit
        });

        return {
            count,
            data: products
        }
    }

    async findById(id: number): Promise<Product> {
        try {
            const product = await this.prismaClient.product.findFirstOrThrow({
                where: {
                    id
                }
            });
            return product;
        } catch (err: any) {
            throw new NotFoundError('Product not found');
        }
        
    }

    async delete(id: number): Promise<any> {
        try {
            await this.prismaClient.product.delete({
                where: {
                    id
                }
            });
            return 1;
        } catch (err: any) {
            throw new NotFoundError('Product not found');
        }       
    }
}