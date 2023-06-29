import express from 'express';
import {signUp, login, logout, protect, isAdmin} from '../controllers/authController';

const router = express.Router()

router
    .route('/')
    .get()


export default router;