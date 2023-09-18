import express from 'express';
import { protect, isAdmin } from '@controllers/authController';
import {
    getAllProducts,
    getOneProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    createReview,
    getReviews,
    getTopProducts
} from '@controllers/productsController';

const router = express.Router()

router
    .route('/')
    .get(getAllProducts)
    .post(protect, isAdmin, addProduct)

router
    .route('/image')
    .post(protect, isAdmin)

router
    .route('/top')
    .get(getTopProducts)

router
    .route('/:id')
    .get(getOneProduct)
    .put(protect, isAdmin, updateProduct)
    .delete(protect, isAdmin, deleteProduct)

router
    .route('/:id/review')
    .get(getReviews)
    .post(protect, createReview)


export default router;