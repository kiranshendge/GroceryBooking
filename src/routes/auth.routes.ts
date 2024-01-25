import express, { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { AuthInteractor } from '../interactors/authInteractor';
import { IAuthInteractor } from '../interfaces/IAuthInteractor';
import { AuthRepository } from '../repositories/authRepository';
import { IAuthRepository } from '../interfaces/IAuthRepository';
import { INTERFACE_TYPE } from '../utils';
import { Container } from 'inversify';
import authMiddleware from '../middlewares/auth';

const container = new Container();

container.bind<IAuthRepository>(INTERFACE_TYPE.AuthRepository).to(AuthRepository);
container.bind<IAuthInteractor>(INTERFACE_TYPE.AuthInteractor).to(AuthInteractor);
container.bind(INTERFACE_TYPE.AuthController).to(AuthController);

const authRouter: Router = express.Router();

const controller = container.get<AuthController>(INTERFACE_TYPE.AuthController);

authRouter.post('/signup', controller.signUp.bind(controller));
authRouter.post('/login', controller.login.bind(controller));
authRouter.get('/loggedInUser', [authMiddleware], controller.loggedInUser.bind(controller));
authRouter.post('/addToCart',  controller.addItemToCart.bind(controller));
authRouter.delete('/deleteItem/:id',  controller.deleteItemfromCart.bind(controller));
authRouter.put('/updateQuantity/:id',  controller.updateQuantity.bind(controller));
authRouter.get('/cart/:id',  controller.getCart.bind(controller));
authRouter.post('/order',  controller.createOrder.bind(controller));
authRouter.get('/orders/:userId',  controller.listOrders.bind(controller));
authRouter.put('/order/:id',  controller.cancelOrder.bind(controller));
authRouter.get('/orders',  controller.listAllOrders.bind(controller));
authRouter.put('/order/:id/status',  controller.changeStatus.bind(controller));
authRouter.get('/order/:id',  controller.getOrderById.bind(controller));

export default authRouter;