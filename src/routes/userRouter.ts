import express from 'express';
import {
    registerUser, authUser,
    getAllUsers, getUserById,
    getUserProfile, updateUserById,
    updateUserProfile, deleteUser, logoutUser
} from '../controllers/userController';

const router = express.Router()

router
    .route('/')
    .get(getAllUsers)
    .post(registerUser)

router.post('/logout', logoutUser)
router.post('/login', authUser)
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