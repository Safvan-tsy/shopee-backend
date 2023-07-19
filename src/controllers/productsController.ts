import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { Product ,Review} from "../models/productsModel";
import { Request, Response, NextFunction } from 'express';
import multer, { StorageEngine, FileFilterCallback } from 'multer';
import { v2 as cloudinary } from 'cloudinary';

interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
}

const multerStorage: StorageEngine = multer.diskStorage({});
const multerFilter = (req: Request, file: File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

declare global {
    namespace Express {
        interface Request {
            user?: any;
            files?: any;
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

const uploadProdImages = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
])
const prodImageUploader = catchAsync(async (req, res, next) => {
    if (!req.files.imageCover) { return next(new AppError('No mage found', 400)) }

    // Cover image
    const response = await cloudinary.uploader.upload(req.files.imageCover[0].path, {
        folder: 'products', public_id: `prod-${req.user.id}-${Date.now()}-cover`
    });
    req.body.imageCover = response.secure_url;

    // Images
    req.body.images = [];
    if (req.files.images) {
        await Promise.all(
            req.files.images.map(async (file, i) => {
                const response = await cloudinary.uploader.upload(file.path, { folder: 'products', public_id: `prod-${req.user.id}-${Date.now()}-${i + 1}` });

                req.body.images.push(response.secure_url);
            })
        );
    }
    res.status(200).json({
        status: 'success',
        image: req.body.imageCover,
        images: req.body.images
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

    // Check if the user has already reviewed the product
    const alreadyReviewed = await Review.findOne({ user: userId, product: productId });
    if (alreadyReviewed) {
        return next(new AppError('Product already reviewed', 400));
    }

    const rating = Number(req.body.rating);
    const comment = req.body.comment;

    // Create the review document
    const review = await Review.create({
        user: userId,
        product: productId,
        rating: rating,
        comment: comment
    });

    // Update the product's rating and numReviews
    const totalRating = product.rating * product.numReviews;
    const newTotalRating = totalRating + rating;
    const newNumReviews = product.numReviews + 1;
    const newAverageRating = newTotalRating / newNumReviews;

    // Update the product with the new rating and numReviews
    product.rating = newAverageRating;
    product.numReviews = newNumReviews;
    await product.save();

    res.status(201).json({
        status: 'success',
        review: review
    });
});


export {
    getOneProduct,
    getAllProducts,
    addProduct,
    updateProduct,
    uploadProdImages,
    prodImageUploader,
    deleteProduct,
    createReview
}