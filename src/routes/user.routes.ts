import express, { Router } from 'express';
import { UserController } from '../controllers/userController';
import { UserInteractor } from '../interactors/userInteractor';
import { IUserInteractor } from '../interfaces/IUserInteractor';
import { UserRepository } from '../repositories/userRepository';
import { IUserRepository } from '../interfaces/IUserRepository';
import { INTERFACE_TYPE } from '../utils';
import { Container } from 'inversify';
import userMiddleware from '../middlewares/user';
import {createCartSchema, updateQuantitySchema} from '../validations/cart';
import { loginSchema, signUpSchema } from '../validations/customer';
import adminMiddleware from '../middlewares/admin';

const container = new Container();

container.bind<IUserRepository>(INTERFACE_TYPE.AuthRepository).to(UserRepository);
container.bind<IUserInteractor>(INTERFACE_TYPE.AuthInteractor).to(UserInteractor);
container.bind(INTERFACE_TYPE.AuthController).to(UserController);

const userRouter: Router = express.Router();

const controller = container.get<UserController>(INTERFACE_TYPE.AuthController);

userRouter.post('/signup', signUpSchema, controller.signUp.bind(controller));
userRouter.post('/login', loginSchema, controller.login.bind(controller));
userRouter.get('/loggedInUser', [userMiddleware], controller.loggedInUser.bind(controller));
userRouter.post('/addToCart', [userMiddleware], createCartSchema, controller.addItemToCart.bind(controller));
userRouter.delete('/deleteItem/:id',  [userMiddleware], controller.deleteItemfromCart.bind(controller));
userRouter.put('/updateQuantity/:id',  [userMiddleware], updateQuantitySchema,  controller.updateQuantity.bind(controller));
userRouter.get('/cart/', [userMiddleware],  controller.getCart.bind(controller));
userRouter.post('/order', [userMiddleware], controller.createOrder.bind(controller));
userRouter.get('/orderList', [userMiddleware],  controller.listOrders.bind(controller));
userRouter.put('/order/:id', [userMiddleware],  controller.cancelOrder.bind(controller));
userRouter.get('/orders', [userMiddleware, adminMiddleware],  controller.listAllOrders.bind(controller));
userRouter.put('/order/:id/status', [userMiddleware, adminMiddleware],  controller.changeStatus.bind(controller));
userRouter.get('/order/:id', [userMiddleware],  controller.getOrderById.bind(controller));

export default userRouter;