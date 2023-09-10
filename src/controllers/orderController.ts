import Order, { Orders } from "@models/orderModel";
import AppError from "@utils/appError";
import catchAsync from "@utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import jwt from 'jsonwebtoken';
import { generateOTP } from "@utils/utils";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const paymentIntent = catchAsync(async (req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2022-11-15'
    });

    // Convert totalPrice to cents by multiplying it by 100
    const amountInCents = Math.round(req.body.totalPrice * 100);

    const paymentIntents = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'inr',
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.status(200).json({
        status: 'success',
        client_secret: paymentIntents.client_secret
    });
});

const createOrder = catchAsync(async (req, res, next) => {
    // add order data to jwt token with an expiry of 15 minutes
    const otp = generateOTP()
    req.body.otp = otp
    const order = await Order.create(req.body)
    
    // send otp to email 
    
    res.status(200).json({
        status: 'success',
        order
    });
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
        orders
    })

})

const updateOrderToPaid = catchAsync(async (req, res, next) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { isPaid: true, deliveredAt: Date.now() },
        { new: true }
    )

    if (!order) return next(new AppError('failed to update', 400))

    res.status(200).json({
        status: 'success',
        order
    })

})

const updateOrderToDelivered = catchAsync(async (req, res, next) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { isDelivered: true, deliveredAt: Date.now() },
        { new: true }
    )

    if (!order) return next(new AppError('failed to update', 400))

    res.status(200).json({
        status: 'success',
        order
    })

})

const getOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find()

    if (!orders) return next(new AppError('failed to fetch orders', 400))

    res.status(200).json({
        status: 'success',
        orders
    })

})



export {
    getMyOrders,
    getOrderById,
    getOrders,
    updateOrderToDelivered,
    updateOrderToPaid,
    paymentIntent,
    createOrder
}