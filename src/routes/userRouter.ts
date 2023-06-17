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
    .get(getAllUsers)
    .post(signUp)

router.post('/logout', logout)
router.post('/login', login)
router
    .route('/profile')
    .get(protect,getUserProfile)
    .put(protect,updateUserProfile)

// router
//     .route('/:id')
//     .get(getUserById)
//     .put(updateUserById)
//     .delete(deleteUser)

export default router;