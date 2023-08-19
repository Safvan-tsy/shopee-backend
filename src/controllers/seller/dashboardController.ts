import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { Users } from "../../types/user";
import User from "../../models/user/userModel";
import Seller from "../../models/seller/sellerModel";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const plates = catchAsync(async (req, res, next) => {
    let totalOrders: number, totalDelivered: number, totalSales: number, walletBalance: number;
    

})

const graph = catchAsync(async (req, res, next) => {

})

const reviews = catchAsync(async (req, res, next) => {

})

const topProducts = catchAsync(async (req, res, next) => {

})


export {
    plates,
    graph,
    reviews,
    topProducts
}

