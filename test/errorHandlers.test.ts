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

  it('should handle operational errors in development environment', () => {
    const err: AppError = new AppError('Invalid request', 400);
    process.env.API_ENV = 'development';

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      error: err,
      message: 'Invalid request',
      stack: err.stack
    });
  });

  it('should handle operational errors in production environment', () => {
    const err: AppError = new AppError('Invalid request', 400);
    process.env.API_ENV = 'production';

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Invalid request'
    });
  });

  it('should handle non-operational errors in production environment', () => {
    const err: Error = new Error('Internal server error');
    process.env.API_ENV = 'production';

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Something went very wrong!'
    });
  });
});