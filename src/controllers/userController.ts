import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import { createSendToken } from "./authController";
interface AuthenticatedRequest extends Request {
    user?: any; // Replace `any` with the actual type of the `user` property
}



export const getUserProfile = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);
    if(user){
        res.status(200).json({
            status:'success',
            data: {
                user
            }
        })
    }else{
        return next(new AppError('User fetch failed', 400))
    }
})

export const updateUserProfile = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);
    if(user){
       user.name = req.body.name || user.name;
       user.email = req.body.email || user.email;

       if(req.body.password) user.password = req.body.password;
 
       const updatedUser = await user.save();
       
       createSendToken(updatedUser, 200, res);
    }else{
        return next(new AppError('user profile fetching failed',400))
    }


})

export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


})

export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


})

export const getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


})

export const updateUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


})