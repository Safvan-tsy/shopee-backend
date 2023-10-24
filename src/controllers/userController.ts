import AppError from "@utils/appError";
import catchAsync from "@utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import User from "@models/user/userModel";
import Cart, { CartType } from "@models/user/cartModel"
import { createSendToken } from "@controllers/authController";
import { ClientSession } from "mongodb";
import { Document, Model, DocumentSetOptions, QueryOptions, UpdateQuery, AnyObject, PopulateOptions, MergeType, Query, SaveOptions, ToObjectOptions, FlattenMaps, Require_id, UpdateWithAggregationPipeline, pathsToSkip, Error } from "mongoose";

interface AuthenticatedRequest extends Request {
    user?: any; // Replace `any` with the actual type of the `user` property
}



const getUserProfile = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    } else {
        return next(new AppError('User fetch failed', 400))
    }
})

const updateUserProfile = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) user.password = req.body.password;

        const updatedUser = await user.save();

        createSendToken(updatedUser, 200, res);
    } else {
        return next(new AppError('user profile fetching failed', 400))
    }


})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});

    res.status(200).json({
        ststus: 'success',
        users: users
    })

})

const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.isAdmin) return next(new AppError('Can delete user', 400));
        await User.deleteOne({ _id: req.params.id })
        res.status(204).json({
            status: 'success'
        })
    } else {
        return next(new AppError('No user found', 404))
    }
})

const getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id)
    if (!user) return next(new AppError('No user found', 400))
    res.status(200).json({
        status: 'success',
        user
    })

})

const updateUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, data, {
        new: true
    })
    if (!user) {
        return next(new AppError('Updating user failed', 400))
    }
    res.status(200).json({
        status: 'success',
        user
    })
})

const addCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const qry ={
        userId: req.user._id,
        sellerId: req.body.sellerId,
    }
    const existingCart = await Cart.findOne(qry)
    req.body.itemsPrice = req.body.price*req.body.qty
    req.body.taxPrice =(req.body.itemsPrice/100)*4
    req.body.totalPrice = req.body.itemsPrice + req.body.taxPrice + req.body.shippingPrice;

    if (existingCart) {
        const newItem = {
            name: req.body.productName,
            qty: req.body.qty,
            image: req.body.ProductImage,
            price: req.body.price,
            productId: req.body.productId,
            itemsPrice: req.body.itemsPrice,
            taxPrice: req.body.taxPrice,
            shippingPrice: req.body.shippingPrice,
            totalPrice: req.body.totalPrice,
        }
        existingCart.orderItems.push(newItem)
        // existingCart.cartTotal= existingCart.
        await existingCart.save()
        res.status(201).json({
            status:"success",
            cart:existingCart
        })
    }
    req.body.itemsPrice = req.body.price*req.body.qty
    req.body.taxPrice =(req.body.itemsPrice/100)*4
    req.body.totalPrice = req.body.itemsPrice + req.body.taxPrice + req.body.shippingPrice;

    const cartData = {
        userId: req.user._id,
        sellerId: req.body.sellerId,
        status: "Open",
        orderItems: [
            {
                name: req.body.productName,
                qty: req.body.qty,
                image: req.body.ProductImage,
                price: req.body.price,
                productId: req.body.productId,
                itemsPrice: req.body.itemsPrice,
                taxPrice: req.body.taxPrice,
                shippingPrice: req.body.shippingPrice,
                totalPrice: req.body.totalPrice
            }
        ],
        paymentMethod: "COD",
        cartTotal:req.body.totalPrice,
        isPaid: false,
        paidAt: undefined,
        isDelivered: false,
        deliveredAt: undefined,
    }
    const cart = await Cart.create(cartData)
    res.status(201)
        .json({
            status: "success",
            cart
        })
})
const getCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

export {
    getAllUsers,
    getUserById,
    getUserProfile,
    updateUserProfile,
    updateUserById,
    deleteUser,
    getCart,
    addCart
}