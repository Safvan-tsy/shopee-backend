import express from 'express';
import { registerSeller } from '../../controllers/sellerController';
import {protect, isAdmin, isSeller} from '../../controllers/authController';

const router = express.Router()

router
    .route('/register')
    .post(protect,registerSeller)

router.get('/dashboard/plates',protect,isSeller)
router.get('/dashboard/graph',protect,isSeller)
router.get('/dashboard/reviews',protect,isSeller)
router.get('/dashboard/top',protect,isSeller)


export default router;