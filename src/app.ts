import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors'

import AppError from './utils/appError';
import errorHandler from './controllers/errorController';
import productRouter from './routes/productRouter';
import userRouter from './routes/userRouter';
import orderRouter from './routes/orderRoutes';
import sellerRouter from './routes/sellerRoutes';

const app: Express = express();

app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(cors());
app.options('*', cors());

app.use('/api/product',productRouter);
app.use('/api/user',userRouter);
app.use('/api/orders/', orderRouter);
app.use('/api/seller',sellerRouter)

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(errorHandler);

export default app;