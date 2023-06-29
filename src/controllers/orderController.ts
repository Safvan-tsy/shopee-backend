import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const addOrder = catchAsync(async (req, res, next) => {

    res.status(200)

})

const getOrderById = catchAsync(async (req, res, next) => {

    res.status(200)

})

const getMyOrders = catchAsync(async (req, res, next) => {

    res.status(200)

})

const updateOrderToPaid = catchAsync(async (req, res, next) => {

    res.status(200)

})

const updateOrderToDelivered = catchAsync(async (req, res, next) => {

    res.status(200)

})

const getOrders = catchAsync(async(req, res, next) => {

    res.status(200)

})



export { addOrder, getMyOrders, getOrderById, getOrders, updateOrderToDelivered, updateOrderToPaid}