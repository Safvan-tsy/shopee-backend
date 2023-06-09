import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: any; // Replace `any` with the actual type of the `user` property
}

const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
};

export const createSendToken = (user: any, statusCode: number, res: Response) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRY) * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure: process.env.NODE_ENV !== 'development'
    };

    res.cookie('jwt', token, cookieOptions)

    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });

};

const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return next(new AppError('user already exist, Try loging in!', 400))

    const newUser = await User.create(
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role,
            isAdmin: req.body.isAdmin
        }
    )

    createSendToken(newUser, 201, res)
})

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400)); ////problem in App Error , not throwing error
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPasswords(password, user.password))) {

        return next(new AppError('Incorrect Email or password!', 404));
    }

    createSendToken(user, 200, res);

})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('jwt','',{
        httpOnly:true,
        expires:new Date(0)
    });

    res.status(200).json({
        status:'success',
        message:'logout success'
    })

})

const protect = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token: string;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findOne(decoded._id)
            next();
        } catch (error) {
            return next(new AppError('Not authorized, token verification failed', 401))
        }

    } else {
        return next(new AppError('Not authorized', 401))
    }

})

const isAdmin = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return next(new AppError('not authorized admin', 401))
    }

})

export { isAdmin, protect, login, logout, signUp }