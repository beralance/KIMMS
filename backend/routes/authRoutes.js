import express from 'express'
import { login, signup, createStaff, deleteStaff, googleLogin, verifyEmail, resendCode, updateAddress} from '../controllers/authController.js'
import {verifyToken, adminOnly, requireRole} from '../middleware/authMiddleware.js'
import rateLimit from '../middleware/rateLimitMiddleware.js'

const router = express.Router();

// public routes
router.post('/signup', signup);
router.post('/login', rateLimit, login);
router.post('/google-login', rateLimit, googleLogin);
router.post('/verify', verifyEmail);
router.post('/resent-code', rateLimit, resendCode) //add rate limiting
router.patch('/:userId/address', verifyToken, requireRole(['user']), updateAddress)
// admin only routes
router.post('/create-staff', verifyToken, adminOnly, requireRole(['admin']), createStaff)
router.delete('/delete-staff/:staffId', verifyToken, adminOnly, requireRole(['admin']), deleteStaff)
export default router