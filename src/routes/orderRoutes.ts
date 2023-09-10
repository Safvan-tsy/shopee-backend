import express from 'express';
import { protect, isAdmin } from '@controllers/authController';
import {
    getMyOrders,
    getOrders, 
    updateOrderToDelivered,
    updateOrderToPaid, 
    getOrderById, 
    paymentIntent, 
    createOrder,
} from '@controllers/orderController';

const router = express.Router()

router
    .route('/')
    .get(protect, isAdmin, getOrders)
    .post(protect, createOrder)

router.post('/secret', paymentIntent);
router.route('/mine').get(protect, getMyOrders)
router.route('/:id').get(protect, isAdmin, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, isAdmin, updateOrderToDelivered)


export default router;