import { Request, Response, NextFunction } from 'express';

type CatchAsync = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const catchAsync = (fn: CatchAsync) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;