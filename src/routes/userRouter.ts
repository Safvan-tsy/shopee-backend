import express from 'express';
import {
    getAllUsers, getUserById,
    getUserProfile, updateUserById,
    updateUserProfile, deleteUser
} from '../controllers/userController';
import {signUp, login, logout, protect, isAdmin} from '../controllers/authController';

const router = express.Router()

router
    .route('/')
    .get(protect,isAdmin,getAllUsers)

router
    .route('/signup')
    .post(signUp)

router.post('/logout', logout)
router.post('/login', login)
router
    .route('/profile')
    .get(protect,getUserProfile)
    .put(protect,updateUserProfile)

router
    .route('/:id')
    .get(protect,isAdmin,getUserById)
    .put(protect,isAdmin,updateUserById)
    .delete(protect,isAdmin,deleteUser)

export default router;