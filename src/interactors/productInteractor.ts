import { inject, injectable } from "inversify";
import { IProductInteractor } from "../interfaces/IProductInteractor";
import { IProductRepository } from "../interfaces/IProductRepository";
import { INTERFACE_TYPE } from "../utils";
import { Product } from "../entities/product";

@injectable()
export class ProductInteractor implements IProductInteractor {
    private productRepository : IProductRepository;

    constructor(@inject (INTERFACE_TYPE.ProductRepository) repository: IProductRepository) {
        this.productRepository = repository;
    }

    async createProduct(product: any): Promise<Product> {
        product.tags = product.tags.join(',');
        const resp = await this.productRepository.create(product);
        return resp;
    }

    async updateProduct(id: number, data: any): Promise<Product> {
        const product = data;
        if (product.tags) {
            product.tags = product.tags.join(',');
        }
        const resp = await this.productRepository.update(id, product);
        return resp;
    }

    getProductById(id: number): Promise<Product> {
        const data = this.productRepository.findById(id);
        return data;
    }

    deleteProducts(id: number): Promise<any> {
        const data = this.productRepository.delete(id);
        return data;
    }
    updateQuantity(id: number, quantity: number): Promise<Product> {
        const data = this.productRepository.update(id, quantity);
        return data;
    }
    getProducts(limit: number, offset: number): Promise<any> {
        return this.productRepository.find(limit, offset);
    }
}