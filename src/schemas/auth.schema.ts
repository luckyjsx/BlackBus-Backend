import { z } from 'zod';

export const registerSchema = z.object({
    firstName: z.string().min(1,  'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const loginSchema = z.object({
    email: z.email('Invalid email'),
    password: z.string().min(6, 'Password is required.'),
});

export const verifyOtpSchema = z.object({
    email: z.email('Invalid email'),
    otp: z.string().min(1, 'OTP is required'),
});

export const forgotPasswordSchema = z.object({
    email: z.email('Invalid email'),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
});

export const resendOtpSchema  = z.object({
    email: z.email('Invalid email'),
});

export const googleAuthSchema = z.object({
  idToken: z
    .string()
    .min(1, 'idToken is required'),
});


 