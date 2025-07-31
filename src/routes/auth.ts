import express from 'express';
import { register, login, verifyOtp, resetPassword, forgotPassword, serveResetPasswordForm, resendOtp } from '../controller/auth';
import { forgotPasswordSchema, loginSchema, registerSchema, resendOtpSchema, resetPasswordSchema, verifyOtpSchema } from '@src/schemas/auth.schema';
import validateRequest from '@src/middleware/validateRequest';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/verify-otp', validateRequest(verifyOtpSchema), verifyOtp);
router.post('/reset-password', validateRequest(resetPasswordSchema) , resetPassword);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
router.get('/reset-password-form', serveResetPasswordForm);
router.post('/resend-otp', validateRequest(resendOtpSchema), resendOtp);

export default router;       