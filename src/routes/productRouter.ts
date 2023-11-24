import express from 'express';
import { protect } from '@controllers/authController';
import {
    getOneProduct,
    createReview,
    getReviews,
    getTopProducts
} from '@controllers/productsController';

const router = express.Router()


router
    .route('/top')
    .get(getTopProducts)

router
    .route('/:id')
    .get(getOneProduct)


router
    .route('/:id/review')
    .get(getReviews)
    .post(protect, createReview)


export default router;