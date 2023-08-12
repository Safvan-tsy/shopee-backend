import express from 'express';
import { registerSeller } from '../controllers/sellerController';
import {protect, isAdmin, isSeller} from '../controllers/authController';

const router = express.Router()

router
    .route('/register')
    .post(protect,registerSeller)


export default router;