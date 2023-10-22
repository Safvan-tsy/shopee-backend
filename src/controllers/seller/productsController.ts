import AppError from "@utils/appError";
import catchAsync from "@utils/catchAsync";
import Product from "@models/product/productsModel"
import { APIFeatures } from "@utils/apiFeatures";
import Seller from "@models/seller/sellerModel";
import { Request} from 'express';
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
        }
    }
}


const uploadProdImages = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
])
const prodImageUploader = catchAsync(async (req, res, next) => {
    if (!req.files.imageCover) { return next(new AppError('No mage found', 400)) }

    const response = await cloudinary.uploader.upload(req.files.imageCover[0].path, {
        folder: 'products', public_id: `prod-${req.user.id}-${Date.now()}-cover`
    });
    req.body.imageCover = response.secure_url;

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

const getProductList = catchAsync(async (req, res, next) => {
    const seller = await Seller.findOne({userId:req.user._id});
    const qry = {
        ...req.query,
        sellerId: seller._id
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
    const seller = await Seller.findOne({userId:req.user._id});

    if (!product || !seller || product.sellerId.toString() !== seller._id.toString()) {
        return next(new AppError('You can\'t update that product', 400));
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
    const seller = await Seller.findOne({userId:req.user._id});
    if (product.sellerId.toString() == seller._id.toString()) {
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
    console.log(req.user)
    const seller = req.user;
    console.log(seller)
    req.body.sellerId = seller._id;
    const product = await Product.create(req.body);

    console.log(product)
    if (!product) {
        return next(new AppError('Product not created', 400));
    }

    res.status(201).json({
        status: 'success',
        product
    });
})

export {
    getProductDetails,
    getProductList,
    updateProduct,
    deleteProduct,
    createProduct,
    uploadProdImages,
    prodImageUploader
}