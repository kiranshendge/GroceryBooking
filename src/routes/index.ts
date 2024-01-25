import { Router } from 'express';
import authRouter  from './auth.routes';
import productRouter from './product.routes';

const rootRouter : Router = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/product', productRouter);

export default rootRouter;