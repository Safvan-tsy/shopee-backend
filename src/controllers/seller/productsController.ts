import AppError from "@utils/appError";
import catchAsync from "@utils/catchAsync";
import Product from "@models/product/productsModel"
import { APIFeatures } from "@utils/apiFeatures";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const getProductList = catchAsync(async (req, res, next) => {
    const qry = {
        ...req.query,
        sellerId: req.user._id
    }
    const features = new APIFeatures(Product.find(), qry).limitFields().filter().sort().paginate();
    await features.countPages();
    const products = await features.query;
    res.status(200).json({
        status: 'products fetched successfully',
        productsCount: products.length,
        currentPage: features.currentPage,
        totalPages: features.totalPages,
        products
    });
})

const getProductDetails = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    //get max detail like total sales view count , total orders
    if (!product) return next(new AppError('Product', 404))

    res.status(200).json({
        status: "success",
        product
    })
})

const updateProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (product.sellerId !== req.user._id) {
        return next(new AppError('You cant update that product', 400))
    }
    const updatedDoc = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: "success",
        product: updatedDoc
    })
})

const deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (product.sellerId == req.user._id) {
        await Product.deleteOne({ _id: req.params.id });
        res.status(204).json({
            status: 'success',
            message: 'Deleted'
        })
    } else {
        return next(new AppError('Product not deleted', 400));
    }
})

const createProduct = catchAsync(async (req, res, next) => {
    req.body.sellerId = req.user._id;
    const product = await Product.create(req.body);

    if (!product) {
        return next(new AppError('Product not created', 400));
    }

    res.status(201).json({
        status: 'Product created successfully',
        product
    });
})

export = {
    getProductDetails,
    getProductList,
    updateProduct,
    deleteProduct,
    createProduct
}