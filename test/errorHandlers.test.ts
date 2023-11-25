import { Request, Response, NextFunction } from 'express';
import errorHandler from '../src/controllers/errorController';
import AppError from '../src/utils/appError';

describe('errorHandler', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    next = jest.fn();
  });

  describe('errorHandler', () => {
    it('should ', () => {
  
    });
  })

});