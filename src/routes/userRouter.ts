import express from 'express';
import {
    getAllUsers, getUserById,
    getUserProfile, updateUserById,
    updateUserProfile, deleteUser
} from '../controllers/userController';
import {signUp, login, logout} from '../controllers/authController';

const router = express.Router()

router
    .route('/')
    .get(getAllUsers)
    .post(signUp)

router.post('/logout', logout)
router.post('/login', login)
router
    .route('/profile')
    .get(getUserProfile)
    .put(updateUserProfile)

// router
//     .route('/:id')
//     .get(getUserById)
//     .put(updateUserById)
//     .delete(deleteUser)

export default router;