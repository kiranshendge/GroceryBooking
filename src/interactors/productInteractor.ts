import { inject, injectable } from "inversify";
import { IProductInteractor } from "../interfaces/IProductInteractor";
import { IProductRepository } from "../interfaces/IProductRepository";
import { INTERFACE_TYPE } from "../utils";

@injectable()
export class ProductInteractor implements IProductInteractor {
    private productRepository : IProductRepository;

    constructor(@inject (INTERFACE_TYPE.ProductRepository) repository: IProductRepository) {
        this.productRepository = repository;
    }

    async createProduct(product: any) {
        product.tags = product.tags.join(',');
        const resp = await this.productRepository.create(product);
        return resp;
    }

    async updateProduct(id: number, data: any) {
        const product = data;
        if (product.tags) {
            product.tags = product.tags.join(',');
        }
        const resp = await this.productRepository.update(id, product);
        return resp;
    }
    searchProducts(input: string) {
        throw new Error("Method not implemented.");
    }
    getProductById(id: number) {
        const data = this.productRepository.findById(id);
        return data;
    }
    deleteProducts(id: number) {
        const data = this.productRepository.delete(id);
        return data;
    }
    updateQuantity(id: number, quantity: number) {
        const data = this.productRepository.update(id, quantity);
        return data;
    }
    getProducts(limit: number, offset: number) {
        return this.productRepository.find(limit, offset);
    }
}