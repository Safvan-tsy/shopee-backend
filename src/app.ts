import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

import AppError from './utils/appError';
import errorHandler from './controllers/errorController';
import userRouter from './routes/userRouter';

const app: Express = express();

app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());
app.use(mongoSanitize());

app.use('/api/user',userRouter)

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(errorHandler);

export default app;