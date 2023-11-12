import AppError from "@utils/appError";
import catchAsync from "@utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@typeStore/user";
import Seller from "@models/seller/sellerModel";
import Order from "@models/orderModel";
import { APIFeatures } from "@utils/apiFeatures";
import { Email } from "@utils/email";
import User from "@models/user/userModel";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const getOrderList = catchAsync(async (req, res, next) => {
    const seller = req.user
    const qry = {
        ...req.query,
        sellerId: seller._id
    }
    const features = new APIFeatures(Order.find(), qry).limitFields().filter().sort().paginate();
    await features.countPages();
    const orders = await features.query;
    res.status(200).json({
        status: 'success',
        ordersCount: orders.length,
        currentPage: features.currentPage,
        totalPages: features.totalPages,
        orders
    });
})

const getOrderDetails = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new AppError('order not found', 404))

    res.status(200).json({
        status: "success",
        order
    })
})

const updateOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    const seller = req.user
    if (order.sellerId.toString() !== seller._id.toString()) {
        return next(new AppError('You cant update that order', 400))
    }
    const updatedDoc = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    ///// send mail to user

    res.status(200).json({
        status: "success",
        order: updatedDoc
    })
})

const sendDeliveryOtp = catchAsync(async (req, res, next) => {
    const seller = req.user
    const order = await Order.findById(req.params.id).select('+otp');
    
    if (!order || order.sellerId.toString() !== seller._id.toString()) return next(new AppError('order not found', 404))
    const user = await User.findById(order.userId)


    // await new Email(user,order.otp).sendDeliveryOtp()
    // /////////// send mail to user0000

    res.status(200).json({
        status: "success",
        
    })
})

const confirmDelivery = catchAsync(async (req, res, next) => {
    const otp = req.body.otp
    const seller = req.user
    const order = await Order.findById(req.params.id).select('+otp');
    const user = await User.findById(order.userId)

    if (!order || order.sellerId.toString() !== seller._id.toString()) return next(new AppError('order not found', 404))
    // if (otp !== order.otp) return next(new AppError('Wrong otp', 400))

    order.isDelivered = true
    order.deliveredAt = new Date()
    await order.save()

    await new Email(user).sendOrderDelivered()

    res.status(200).json({
        status: "success",
        order
    })
})

const cancelOrder = catchAsync(async (req, res, next) => {
    const seller = req.user
    const order = await Order.findById(req.params.id);

    if (!order || order.sellerId.toString() !== seller._id.toString()) return next(new AppError('order not found', 404))
    order.status = "Cancelled"
    order.statusDescription = req.body.reason

    /////////// send mail to user


    await order.save();

    res.status(200).json({
        status: "order cancelled"
    })

})


export {
    getOrderDetails,
    getOrderList,
    updateOrder,
    confirmDelivery,
    cancelOrder,
    sendDeliveryOtp
};