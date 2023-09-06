import AppError from "@utils/appError";
import catchAsync from "@utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@typeStore/user";
import Seller from "@models/seller/sellerModel";
import Order from "@models/orderModel";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const getOrderList = catchAsync(async (req, res, next) => {})

const getOrderDetails = catchAsync(async (req, res, next) => {})

const updateOrder = catchAsync(async (req, res, next) => {})

const confirmDelivery = catchAsync(async (req, res, next) => {})

export = {
    getOrderDetails,
    getOrderList,
    updateOrder,
    confirmDelivery
}