import express from 'express'
import {setStaffPermissions, getStaffPermissions, getAllStaffPermissions} from '../controllers/staffPermissionController.js'
import { verifyToken, adminOnly, requireRole } from '../middleware/authMiddleware.js'

const router = express.Router()

// admin assign or updates staff permissions
router.post('/set-permissions', verifyToken, adminOnly, setStaffPermissions)

// get staff permissions (admin can view anyone, staff can only view their own)
router.get('/all', verifyToken, adminOnly, getAllStaffPermissions)
router.get('/:staffId', verifyToken, requireRole(['admin', 'staff']), getStaffPermissions);

export default router;