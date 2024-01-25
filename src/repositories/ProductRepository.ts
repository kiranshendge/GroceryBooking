
import { IProductRepository } from '../interfaces/IProductRepository';
import { Product } from '../entities/product';
import { injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';

@injectable()
export class ProductRepository implements IProductRepository {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }
    
    async create(input: Product): Promise<any> {
        const product = await this.prismaClient.product.create({
            data: {
                ...input
            }
        })
        return product;
    }

    async update(id: number, product: Product): Promise<Product> {
        const updatedProduct = await this.prismaClient.product.update({
            where : {
                id: id
            },
            data: product
        });
        return updatedProduct;
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
        const product = await this.prismaClient.product.findFirstOrThrow({
            where: {
                id
            }
        });
        return product;
    }

    async delete(id: number): Promise<any> {
        await this.prismaClient.product.delete({
            where: {
                id
            }
        });
        return 1;
    }
}