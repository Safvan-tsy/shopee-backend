import express from 'express';
import { signUp, login, logout, protect, isAdmin } from '../controllers/authController';
import {
    addOrder, getMyOrders,
    getOrders, updateOrderToDelivered,
    updateOrderToPaid, getOrderById
} from '../controllers/orderController';

const router = express.Router()

router.route('/').get(protect, isAdmin, getOrders).post(protect, addOrder)
router.route('/mine').get(protect, getMyOrders)
router.route('/:id').get(protect, isAdmin, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, isAdmin, updateOrderToDelivered)


export default router;