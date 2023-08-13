import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/user";
import User from "../models/user/userModel";
import { signToken } from "./authController";
import Seller from "../models/seller/sellerModel";

const createSendToken = (user: any, seller: any, statusCode: number, res: Response) => {
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
            user,
            seller
        }
    });

};
const registerSeller = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id).select('+password');
    if (!user || !(await user.correctPasswords(req.body.password, user.password))) {

        return next(new AppError('Incorrect password!', 404));
    }

    if (user) {
        const seller = await Seller.create({
            userId: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isSeller: true,
            displayName: req.body.displayName,
            pan: req.body.pan,
            phone: req.body.phone
        })
        user.isSeller = true;
        const updatedUser = await user.save();
        createSendToken(updatedUser, seller, 200, res);
    } else {
        return next(new AppError('user profile fetching failed', 400))
    }
})


export {
    registerSeller
}

