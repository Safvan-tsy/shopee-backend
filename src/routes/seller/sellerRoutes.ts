import express from 'express';
import { registerSeller } from '@controllers/seller/sellerController';
import {protect, isAdmin, isSeller} from '@controllers/authController';
import { sendDeliveryOtp } from '@controllers/seller/orderController';

const router = express.Router();

router.route('/register').post(protect, registerSeller);

// Add route logging for debugging purposes
router.use((req, res, next) => {
  console.log(`Received request for ${req.url}`);
  next();
});

router.get('/dashboard/plates', protect, isSeller);
router.get('/dashboard/graph', protect, isSeller);
router.get('/dashboard/reviews', protect, isSeller);
router.get('/dashboard/top', protect, isSeller);

router.get('/order/sendotp', sendDeliveryOtp);

export default router;