import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    getCarts,
    addCart,
    deleteCart
} from '../controllers/userController';
import {
    signUp,
    login,
    logout,
    protect
} from '../controllers/authController';

const router = express.Router()


router
    .route('/signup')
    .post(signUp)

router.post('/logout', logout)
router.post('/login', login)
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)

router
    .route('/cart')
    .get(protect, getCarts)
    .post(protect, addCart)

router
    .route('/cart/:id')
    .delete(protect, deleteCart)


export default router;