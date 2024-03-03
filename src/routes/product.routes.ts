import express from 'express';
import { ProductController } from '../controllers/productController';
import { ProductInteractor } from '../interactors/productInteractor';
import { IProductInteractor } from '../interfaces/IProductInteractor';
import { ProductRepository } from '../repositories/ProductRepository';
import { IProductRepository } from '../interfaces/IProductRepository';
import { INTERFACE_TYPE } from '../utils';
import { Container } from 'inversify';
import userMiddleware from '../middlewares/user';
import adminMiddleware from '../middlewares/admin';

const container = new Container();

container.bind<IProductRepository>(INTERFACE_TYPE.ProductRepository).to(ProductRepository);
container.bind<IProductInteractor>(INTERFACE_TYPE.ProductInteractor).to(ProductInteractor);
container.bind(INTERFACE_TYPE.ProductController).to(ProductController);

const productRouter = express.Router();

const controller = container.get<ProductController>(INTERFACE_TYPE.ProductController);

productRouter.get('/', [userMiddleware], controller.onGetProducts.bind(controller));
productRouter.post('/', [userMiddleware, adminMiddleware], controller.onCreateProduct.bind(controller));
productRouter.put('/:id', [userMiddleware, adminMiddleware], controller.onUpdateProduct.bind(controller));
productRouter.delete('/:id', [userMiddleware, adminMiddleware], controller.onDeleteProduct.bind(controller));
productRouter.get('/:id', [userMiddleware, adminMiddleware], controller.onGetProductById.bind(controller));

export default productRouter;