import { Request, Response, NextFunction } from 'express';
import { IProductInteractor } from '../interfaces/IProductInteractor';
import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from '../utils';

@injectable()
export class ProductController {
    private interactor: IProductInteractor;

    constructor(@inject (INTERFACE_TYPE.ProductInteractor) interactor: IProductInteractor) {
        this.interactor = interactor;
    }

    async onCreateProduct(req: Request, res: Response, next: NextFunction) {
        try {
          const data = await this.interactor.createProduct(req.body);
          return res.status(200).json(data);
        } catch (error) {
          next(error);
        }
      }
      async onGetProducts(req: Request, res: Response, next: NextFunction) {
        try {
          const offset = parseInt(`${req.query.offset}`) || 0;
          const limit = parseInt(`${req.query.limit}`) || 10;
    
          const data = await this.interactor.getProducts(limit, offset);
    
          return res.status(200).json(data);
        } catch (error) {
          next(error);
        }
      }
      async onUpdateProduct(req: Request, res: Response, next: NextFunction) {
        try {
          const id = parseInt(req.params.id);
          const product = req.body;
    
          const data = await this.interactor.updateProduct(id, product);
    
          return res.status(200).json(data);
        } catch (error) {
          next(error);
        }
      }

      async onGetProductById(req: Request, res: Response, next: NextFunction) {
        try {
          const id = parseInt(req.params.id);
    
          const data = await this.interactor.getProductById(id);
    
          return res.status(200).json(data);
        } catch (error) {
          next(error);
        }
      }

      async onDeleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
          const id = parseInt(req.params.id);
    
          let data = await this.interactor.deleteProducts(id);
          if (data === 1) {
            data = 'product removed successfully';
          }
    
          return res.status(200).json(data);
        } catch (error) {
          next(error);
        }
      }
}