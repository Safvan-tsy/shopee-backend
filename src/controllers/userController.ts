import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";

export const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {name, email} = req.body;
})

export const authUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
const {email, password} = req.body;
console.log('hi')

if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400)); ////problem in App Error , not throwing error
  }
  console.log('hi 2')
const user = await User.findOne({email}).select('+password');
    
if (!user || !(await user.correctPasswords(password, user.password))) {
    console.log('hi 3')
  return next(new AppError('Incorrect Email or password!', 404));
}
console.log('hi 4')
})

export const logoutUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


})

export const getUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


})

export const updateUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


})

export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


})

export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


})

export const getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


})

export const updateUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


})