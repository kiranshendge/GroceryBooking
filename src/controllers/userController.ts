import { Request, Response, NextFunction } from 'express';
import { IUserInteractor } from '../interfaces/IUserInteractor';
import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from '../utils';
import { STATUS_CODES } from '../exceptions/app_error';

@injectable()
export class UserController {
    private interactor: IUserInteractor;

    constructor(@inject (INTERFACE_TYPE.AuthInteractor) interactor: IUserInteractor) {
        this.interactor = interactor;
    }

  async signUp(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { email, password, name, role } = req.body;
      const data = await this.interactor.signUp(email, password, name, role);
      return res.status(STATUS_CODES.OK).json(data);
    } catch (error: any) {
      next(error);
    }
  }
  
  async login(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {    
      const data = await this.interactor.login(req.body);
      return res.status(STATUS_CODES.OK).json(data);
    } catch (error: any) {
      next(error);
    }
  }

  async loggedInUser(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      res.json(req.user);
    }
    catch (error: any) {
      next(error);
    }
  }

  async addItemToCart(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      req.body.userId = req.user.id;   
      const data = await this.interactor.addItemToCart(req.body);

      return res.status(STATUS_CODES.OK).json(data);
    } catch (error: any) {
      next(error);
    }
  }

  async deleteItemfromCart(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {   
      const id = parseInt(req.params.id); 
      const data = await this.interactor.deleteItemFromCart(id);

      return res.status(STATUS_CODES.OK).json(data);
    } catch (error: any) {
      next(error);
    }
  }

  async updateQuantity(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {    
      const id = parseInt(req.params.id);
      const data = await this.interactor.updateQuantity(id, req.body.quantity);

      return res.status(STATUS_CODES.OK).json(data);
    } catch (error: any) {
      next(error);
    }
  }

  async getCart(req: any, res: Response, next: NextFunction): Promise<any> {
    try {   
      const userId = parseInt(req.user.id); 
      const data = await this.interactor.getCart(userId);

      return res.status(STATUS_CODES.OK).json(data);
    } catch (error: any) {
      next(error);
    }
  }

  async createOrder(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      req.body.userId = req.user?.id;
      const data = await this.interactor.createOrder(req.body);
      return res.status(STATUS_CODES.OK).json(data);
    } catch (error: any) {
      next(error);
    }
  }
  async listOrders(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      const data = await this.interactor.listOrders(parseInt(req.user?.id));

      return res.status(STATUS_CODES.OK).json(data);
    } catch (error: any) {
      next(error);
    }
  }

  async cancelOrder(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      const data = await this.interactor.cancelOrder(id);
      return res.status(STATUS_CODES.OK).json(data);
    }
    catch (error: any) {
      next(error);
    }
  }

  async listAllOrders(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const orderStatus: any = req.query.status;
      const offset = parseInt(`${req.query.offset}`) || 0;
      const limit = parseInt(`${req.query.limit}`) || 10;
      const data = await this.interactor.listAllOrders(orderStatus, limit, offset);

      return res.status(STATUS_CODES.OK).json(data);
    } catch (error: any) {
      next(error);
    }
  }

  async changeStatus(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      const status: any = req.query.orderStatus;
      const data = await this.interactor.changeStatus(id, status);

      return res.status(STATUS_CODES.OK).json(data);
    } catch (error: any) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      const data = await this.interactor.getOrderById(id);

      return res.status(STATUS_CODES.OK).json(data);
    } catch (error: any) {
      next(error);
    }
  }
}