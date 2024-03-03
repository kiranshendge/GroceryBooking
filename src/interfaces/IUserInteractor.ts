export interface IUserInteractor {
    signUp(email: string, password: string, name: string, role: any): any;
    login(input: any): any;
    findUser(criteria: string, value: any): any;
    addItemToCart(cart: any): any;
    deleteItemFromCart(id: number): any;
    updateQuantity(id: number, quantity: number): any;
    getCart(userId: number): any;
    createOrder(order: any): any;
    listOrders(userId: number): any;
    cancelOrder(id: number): any;
    listAllOrders(orderStatus: string, limit: number, offset: number): any;
    changeStatus(id: number, status: any): any;
    getOrderById(id: number): any;
}