import express from 'express';
import {
  login,
  logout,
  protect,
  isSeller
} from '../../controllers/seller/authController';
import { protect as userProtect } from '../../controllers/authController';
import {
  deleteSeller,
  getSellerProfile,
  registerSeller,
  updateSeller
} from '../../controllers/seller/sellerController';

import {
  cancelOrder,
  getOrderDetails,
  getOrderList,
  updateOrder
} from '../../controllers/seller/orderController';
import {
  createProduct,
  deleteProduct,
  getProductDetails,
  getProductList,
  prodImageUploader,
  updateProduct,
  uploadProdImages
} from '../../controllers/seller/productsController';

const router = express.Router();

router.route('/register').post(userProtect, registerSeller);

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

router
  .route('/products/image')
  .post(protect, isSeller, uploadProdImages, prodImageUploader)

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

router
  .route('/auth/login')
  .post(login)

router
  .route('/auth/logout')
  .post(logout)



export default router;