import { Router } from 'express';
import authRouter  from './user.routes';
import productRouter from './product.routes';

const rootRouter : Router = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/product', productRouter);

export default rootRouter;