import AppError from '@utils/appError'
import catchAsync from "@utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import User from "@models/user/userModel";
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from "@typeStore/user";
import Seller from "@models/seller/sellerModel";

export const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
};

export const createSendToken = async(seller: any,statusCode: number, res: Response) => {
    const token = signToken(seller._id)
    const cookieOptions = {
        expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRY) * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure: process.env.NODE_ENV !== 'development'
    };

    res.cookie('jwt', token, cookieOptions)

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            seller
        }
    });

};

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400)); 
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPasswords(password, user.password))) {
        return next(new AppError('Incorrect Email or password!', 404));
    }

    const seller = await Seller.findOne({userId:user._id});
    if(seller){
        createSendToken(seller,200,res);
    }else{
        res.status(403).json({
            status:"Fail",
            message:"Not Authorized"
        })
    }
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({
        status: 'success',
        message: 'logout success'
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
            req.user = await Seller.findById(decoded.id)
            next();
        } catch (error) {
            return next(new AppError('Not authorized, token verification failed', 401))
        }

    } else {
        return next(new AppError('Not authorized', 401))
    }

})

const isSeller = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.isSeller) {
        next();
    } else {
        return next(new AppError('not authorized Seller', 401))
    }
})

export {
    protect,
    login,
    logout,
    isSeller
}