import express from 'express';
import {
  deleteSeller,
  getSellerProfile,
  registerSeller,
  updateSeller
} from '@controllers/seller/sellerController';
import { protect, isAdmin, isSeller } from '@controllers/authController';
import {
  cancelOrder,
  confirmDelivery,
  getOrderDetails,
  getOrderList,
  sendDeliveryOtp,
  updateOrder
} from '@controllers/seller/orderController';
import {
  createProduct,
  deleteProduct,
  getProductDetails,
  getProductList,
  updateProduct
} from '@controllers/seller/productsController';

const router = express.Router();

router.route('/register').post(protect, registerSeller);

// router.get('/dashboard/plates', protect, isSeller);
// router.get('/dashboard/graph', protect, isSeller);
// router.get('/dashboard/reviews', protect, isSeller);
// router.get('/dashboard/top', protect, isSeller);

router.get('/orders', protect, isSeller, getOrderList);
router
  .route('/orders/:id')
  .get(protect, isSeller, getOrderDetails)
  .put(protect, isSeller, updateOrder)
  .patch(protect, isSeller, cancelOrder)

router.post('/orders/confirm/:id', protect, isSeller, confirmDelivery);
router.get('/orders/send-otp/:id', protect, isSeller, sendDeliveryOtp);

router
  .route('/products/:id')
  .put(protect, isSeller, updateProduct)
  .delete(protect, isSeller, deleteProduct)
  .get(protect, isSeller, getProductDetails)

router
  .route('/products')
  .post(protect, isSeller, createProduct)
  .get(protect, isSeller, getProductList)

router
  .route('/')
  .put(protect, isSeller, updateSeller)
  .delete(protect, isSeller, deleteSeller)
  .get(protect, isSeller, getSellerProfile)


export default router;