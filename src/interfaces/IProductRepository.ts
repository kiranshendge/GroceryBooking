import { Product } from "../entities/product";

export interface IProductRepository {
    create(data: Product) : Promise<Product>;
    update(id: number, product: any) : Promise<Product>;
    find(limit: number, offset: number) : Promise<any>;
    findById(id: number): Promise<Product>;
    delete(id: number) : Promise<any>;
}