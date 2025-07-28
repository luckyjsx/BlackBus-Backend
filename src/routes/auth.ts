import express from 'express';
import { register, login, verifyOtp, resetPassword, forgotPassword, serveResetPasswordForm } from '../controller/auth';

const router = express.Router();

// // register
// router.post('/register', async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;
//   if (!firstName || !lastName || !email || !password) {
//     return res.status(400).json({ success: false, message: 'First name, last name, email, and password are required.' });
//   }
//   try {
//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ success: false, message: 'User already exists.' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new UserModel({ firstName, lastName, email, password: hashedPassword });
//     await user.save();
//     return res.status(201).json({ success: true, message: 'User registered successfully.' });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: 'Server error', error });
//   }
// });

// // login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ success: false, message: 'Email and password are required.' });
//   }
//   try {
//     const user = await UserModel.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ success: false, message: 'Invalid credentials.' });
//     }
//     const isMatch = await bcrypt.compare(password, user.password as string);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: 'Password is Incorrect.' });
//     }
//     const payload = {
//       userId: user._id, 
//       email: user.email
//     }
//     const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
//     const options = {
//       expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//       httpOnly: true, 
//     };
//     user.password = undefined;
//     return res.cookie('token', token, options).status(200).json({
//       success: true,
//       token,
//       user,
//       message: 'Logged in successfully.'
//     })
//   } catch (error) {
//     return res.status(500).json({ message: 'Server error', error });
//   }
// });

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword)
router.post('/forgot-password', forgotPassword)
router.get('/reset-password-form', serveResetPasswordForm)


export default router; 