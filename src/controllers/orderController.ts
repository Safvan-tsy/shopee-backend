import Order from "../models/orderModel";
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
    const { orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        totalPrice,
        shippingPrice
    } = req.body;
    if (orderItems && orderItems.length === 0) {
        return next(new AppError('No order items provided', 400))
    }
    const order = new Order({
        // orderItems: orderItems.map((x) => ({
        //     ...x,
        //     product: x._id,
        //     _id: undefined
        // })),
        // user: req.user.id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        totalPrice,
        shippingPrice
    })
    const createdOrder = await order.save();

    res.status(200).json({
        status: 'success',
        data: {
            order: createdOrder
        }
    })

})

const getOrderById = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return next(new AppError('no order found ', 400))
    res.status(200).json({
        status: 'success',
        data: {
            order
        }

    })

})

const getMyOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id })
    res.status(200).json({
        status: 'success',
        data: {
            orders
        }
    })

})

const updateOrderToPaid = catchAsync(async (req, res, next) => {

    res.status(200)

})

const updateOrderToDelivered = catchAsync(async (req, res, next) => {

    res.status(200)

})

const getOrders = catchAsync(async (req, res, next) => {

    res.status(200)

})



export { addOrder, getMyOrders, getOrderById, getOrders, updateOrderToDelivered, updateOrderToPaid }