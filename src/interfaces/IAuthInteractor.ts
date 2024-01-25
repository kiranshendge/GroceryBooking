export interface IAuthInteractor {
    signUp(email: string, password: string, name: string);
    login(input: any);
    findUser(criteria: string, value: any);
    addItemToCart(cart: any);
    deleteItemFromCart(id: number);
    updateQuantity(id: number, quantity: number);
    getCart(userId: number);
    createOrder(order: any);
    listOrders(userId: number);
    cancelOrder(id: number);
    listAllOrders(orderStatus: string, limit: number, offset: number);
    changeStatus(id: number, status: any);
    getOrderById(id: number)
}