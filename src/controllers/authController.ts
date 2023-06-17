import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import jwt from 'jsonwebtoken';

const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
};

export const createSendToken = (user:any,statusCode:number, res:Response ) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRY) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development'
    };

    res.cookie('jwt',token,cookieOptions)

    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });

};

export const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return next(new AppError('user already exist, Try loging in!', 400))

    const newUser = await User.create(
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role,
            isAdmin:req.body.isAdmin
        }
    )

    createSendToken(newUser, 201, res)
})

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400)); ////problem in App Error , not throwing error
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPasswords(password, user.password))) {

        return next(new AppError('Incorrect Email or password!', 404));
    }

    createSendToken(user,200,res);

})

export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


})