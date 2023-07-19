import express from 'express';
import { protect, isAdmin } from '../controllers/authController';
import {
    getAllProducts,
    getOneProduct,
    addProduct,
    updateProduct,
    prodImageUploader,
    uploadProdImages,
    deleteProduct,
    createReview
} from '../controllers/productsController';

const router = express.Router()

router
    .route('/')
    .get(getAllProducts)
    .post(protect, isAdmin, addProduct)

router
    .route('/image')
    .post(protect, isAdmin, uploadProdImages, prodImageUploader)

router
    .route('/:id')
    .get(getOneProduct)
    .put(protect, isAdmin, updateProduct)
    .delete(protect, isAdmin, deleteProduct)

router
    .route('/:id/review')
    .post(protect,createReview)


export default router;