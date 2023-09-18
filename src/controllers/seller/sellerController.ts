import AppError from "@utils/appError";
import catchAsync from "@utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@typeStore/user";
import User from "@models/user/userModel";
import { signToken } from "@controllers/authController";
import Seller from "@models/seller/sellerModel";

const createSendToken = (user: any, seller: any, statusCode: number, res: Response) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRY) * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure: process.env.NODE_ENV !== 'development'
    };

    res.cookie('jwt', token, cookieOptions)

    user.password = undefined;
    user.seller = seller;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });

};
const registerSeller = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const user = await User.findById(req.user._id).select('+password');
    if (!user || !(await user.correctPasswords(req.body.password, user.password))) {
        return next(new AppError('Incorrect password!', 404));
    }

    if (user) {
        const existingSeller = await Seller.findOne({ email: user.email });
        if (existingSeller) return next(new AppError('seller already exist, Try loging in!', 400))

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

const updateSeller = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const seller = await Seller.findOne({userId:req.user._id});
    if (seller) {
        const seller = await Seller.updateOne({userId:req.user._id}, req.body, {
            new: true,  
            runValidators: true
        })
        res.status(200).json({
            status:"success",
            seller
        })
     
    } else {
        return next(new AppError('Seller profile update failed', 400))
    }
})


const deleteSeller = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const seller = await Seller.findOne({userId:req.user._id});
    if (seller) {
        await User.deleteOne( {userId:req.user._id});
        res.status(204).json({
            status:'success'
        })
    } else {
        return next(new AppError('No seller found', 404))
    }
})

const getSellerProfile = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const seller = await Seller.findOne({userId:req.user._id});
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

