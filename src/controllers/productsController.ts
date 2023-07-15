import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { Product } from "../models/productsModel";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find()

    res.status(200).json({
        status: 'success',
        data: {
            products
        }
    });
})

const getOneProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    res.status(200).json({
        status: "success",
        data: {
            product
        }
    })
})

const addProduct = catchAsync(async (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        user: req.user._id,
        brand: req.body.brand,
        category: req.body.category
    })

    await product.save()
    res.status(201).json({
        status: 'success',
        product
    })
})

const updateProduct = catchAsync(async (req, res, next) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.brand = brand;
        product.image = image;
        product.description = description;
        product.category = category;
        product.countInStock = countInStock;
    }

    const updatedProduct = await product.save()
    res.status(200).json({
        status: 'success',
        product: updatedProduct
    })

})

export { getOneProduct, getAllProducts, addProduct , updateProduct}