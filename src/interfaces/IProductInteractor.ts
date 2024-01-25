export interface IProductInteractor {
    createProduct(input : any);
    updateProduct(id: number, product: any);
    getProducts(limit: number, offset: number);
    searchProducts(input: string);
    getProductById(id: number);
    deleteProducts(id: number);
    updateQuantity(id: number, quantity: number);
}