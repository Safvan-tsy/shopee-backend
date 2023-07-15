import express from 'express';
import { protect, isAdmin } from '../controllers/authController';
import { getAllProducts, getOneProduct, addProduct, updateProduct } from '../controllers/productsController';

const router = express.Router()

router
    .route('/')
    .get(getAllProducts)
    .post(protect, isAdmin, addProduct)

router
    .route('/:id')
    .get(getOneProduct)
    .put(protect, isAdmin, updateProduct)

export default router;