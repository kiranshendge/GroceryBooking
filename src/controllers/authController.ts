import { Request, Response, NextFunction } from 'express';
import { IAuthInteractor } from '../interfaces/IAuthInteractor';
import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from '../utils';

@injectable()
export class AuthController {
    private interactor: IAuthInteractor;

    constructor(@inject (INTERFACE_TYPE.AuthInteractor) interactor: IAuthInteractor) {
        this.interactor = interactor;
    }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      const data = await this.interactor.signUp(email, password, name);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
      async login(req: Request, res: Response, next: NextFunction) {
        try {    
          const data = await this.interactor.login(req.body);
    
          return res.status(200).json(data);
        } catch (error) {
          next(error);
        }
      }

      async loggedInUser(req: any, res: Response, next: NextFunction) {
        try {
          res.json(req.user);
        }
        catch (error) {
          next(error);
        }
      }

      async addItemToCart(req: Request, res: Response, next: NextFunction) {
        try {    
          const data = await this.interactor.addItemToCart(req.body);
    
          return res.status(200).json(data);
        } catch (error) {
          next(error);
        }
      }

      async deleteItemfromCart(req: Request, res: Response, next: NextFunction) {
        try {   
          const id = parseInt(req.params.id); 
          const data = await this.interactor.deleteItemFromCart(id);
    
          return res.status(200).json(data);
        } catch (error) {
          next(error);
        }
      }

      async updateQuantity(req: Request, res: Response, next: NextFunction) {
        try {    
          const id = parseInt(req.params.id);
          const data = await this.interactor.updateQuantity(id, req.body.quantity);
    
          return res.status(200).json(data);
        } catch (error) {
          next(error);
        }
      }

      async getCart(req: Request, res: Response, next: NextFunction) {
        try {   
          const userId = parseInt(req.params.id); 
          const data = await this.interactor.getCart(userId);
    
          return res.status(200).json(data);
        } catch (error) {
          next(error);
        }
      }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.interactor.createOrder(req.body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async listOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.interactor.listOrders(parseInt(req.params.userId));

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req: any, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.interactor.cancelOrder(id);
      return res.status(200).json(data);
    }
    catch (error) {
      next(error);
    }
  }

  async listAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orderStatus: any = req.query.status;
      const offset = parseInt(`${req.query.offset}`) || 0;
      const limit = parseInt(`${req.query.limit}`) || 10;
      const data = await this.interactor.listAllOrders(orderStatus, limit, offset);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async changeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const status: any = req.query.orderStatus;
      const data = await this.interactor.changeStatus(id, status);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.interactor.getOrderById(id);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}