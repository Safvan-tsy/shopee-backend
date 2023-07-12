import express from 'express';
import { protect, isAdmin  } from '../controllers/authController';
import { getAllProducts, getOneProduct, addProduct } from '../controllers/productsController';

const router = express.Router()

router
    .route('/')
    .get(getAllProducts)
    .post(protect, isAdmin, addProduct)

router
    .route('/:id')
    .get(getOneProduct)

export default router;