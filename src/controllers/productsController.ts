import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { Product } from "../models/productsModel";

export const getAllProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find()

    res.status(200).json({
        status: 'success',
        data: {
            products
        }
    });
})

export const getOneProduct = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
    const product = await Product.findById(req.params.id)

    res.status(200).json({
        status:"success",
        data:{
            product
        }
    })
})