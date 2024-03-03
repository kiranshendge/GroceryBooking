import { Product } from "../entities/product";

export interface IProductInteractor {
    createProduct(input : any): Promise<Product>;
    updateProduct(id: number, product: any): Promise<Product>;
    getProducts(limit: number, offset: number): Promise<any>;
    getProductById(id: number): Promise<Product>;
    deleteProducts(id: number): Promise<any>;
    updateQuantity(id: number, quantity: number): Promise<Product>;
}