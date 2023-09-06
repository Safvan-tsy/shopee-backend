import AppError from "@utils/appError";
import catchAsync from "@utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@typeStore/user";
import User from "@models/user/userModel";
import { signToken } from "@controllers/authController";
import Seller from "@models/seller/sellerModel";

export const createSendToken = (seller: any,statusCode: number, res: Response) => {
    const token = signToken(seller._id)
    const cookieOptions = {
        expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRY) * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure: process.env.NODE_ENV !== 'development'
    };

    res.cookie('jwt', token, cookieOptions)

    seller.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        seller,
    });

};

const registerSeller = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const existingSeller = await Seller.findOne({ email: req.body.email });
    if (existingSeller) return next(new AppError('user already exist, Try loging in!', 400))

    const newSeller = await Seller.create(
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role,
            isAdmin: req.body.isAdmin,
            isSeller:req.body.isSeller,
            displayName:req.body.displayName,
            pan:req.body.pan,
            phone:req.body.phone
        }
    )

    createSendToken(newSeller, 201, res)
})

const updateSeller = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const seller = await Seller.findById(req.user._id);
    if (seller) {
        const seller = await Seller.findByIdAndUpdate(req.params.id, req.body, {
            new: true,  
            runValidators: true
        })
        createSendToken(seller, 201, res)
    } else {
        return next(new AppError('Seller profile update failed', 400))
    }
})


const deleteSeller = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const seller = await Seller.findById(req.user._id);
    if (seller) {
        await User.deleteOne({ _id: req.params.id })
        res.status(204).json({
            status:'success'
        })
    } else {
        return next(new AppError('No seller found', 404))
    }
})

const getSellerProfile = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const seller = await Seller.findById(req.user._id);
    if (seller) {
        res.status(200).json({
            status: 'success',
            seller
        })
    } else {
        return next(new AppError('User fetch failed', 400))
    }
})



export {
    registerSeller,
    getSellerProfile,
    updateSeller,
    deleteSeller
}

