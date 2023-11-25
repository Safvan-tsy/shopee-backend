import express from 'express';
import { protect} from '../controllers/authController';
import {
    getMyOrders, 
    getOrderById, 
    createOrder,
} from '../controllers/orderController';

const router = express.Router()

router
    .route('/')
    .post(protect, createOrder)

router.route('/mine').get(protect, getMyOrders)


export default router;