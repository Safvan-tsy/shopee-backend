import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import Product from "../models/product/productsModel";
import { Review } from "../models/product/reviewModel";

declare global {
    namespace Express {
        interface Request {
            user?: any;
            files?: any;
        }
    }
}

const getAllProducts = catchAsync(async (req, res, next) => {
    const limit = 8;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword } } : {};
    const products = await Product.find({ ...keyword }).limit(limit).skip(limit * (page - 1));
    const count = await Product.countDocuments({ ...keyword });

    res.status(200).json({
        status: 'success',
        page,
        pages: Math.ceil(count / limit),
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

const deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        await Product.deleteOne({ _id: req.params.id });
        res.status(204).json({
            status: 'success',
            message: 'Deleted'
        })
    } else {
        res.status(404).json({
            message: 'not found'
        })
    }
})

const createReview = catchAsync(async (req, res, next) => {
    const productId = req.params.id;
    const userId = req.user._id;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError('No product found with that Id', 404));
    }

    // Check if this user has already reviewed this product
    const alreadyReviewed = await Review.findOne({ product: productId, user: userId });
    if (alreadyReviewed) {
        return next(new AppError('Product already reviewed', 400));
    }

    // If not already reviewed, create the review
    const { comment, rating } = req.body;
    const review = new Review({
        product: productId,
        name: req.user.name,
        comment,
        rating,
        user: userId
    });

    await review.save();

    product.reviews.push(review._id);
    product.numReviews = product.reviews.length;
    product.rating = (product.rating * (product.numReviews - 1) + rating) / product.numReviews;
    await product.save();

    res.status(201).json({
        status: 'success',
        review: review
    });
});

const getReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find({ product: req.params.id })
    res.status(200).json({
        status: 'success',
        reviews
    })
})

const getTopProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find().sort({ rating: -1 })

    res.status(200).json({
        status: "success",
        products
    })
})

export {
    getOneProduct,
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    createReview,
    getReviews,
    getTopProducts
}