import express from 'express';
import { adminLogin } from '../controllers/authController.js';
import { getDashboardStats, getAllUsers } from '../controllers/adminController.js';
import { getAllAppointments, updateAppointmentStatus } from '../controllers/appointmentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/appointments', protect, adminOnly, getAllAppointments);
router.put('/appointments/:id', protect, updateAppointmentStatus);

export default router;
