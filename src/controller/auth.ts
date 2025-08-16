import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '@src/model/auth/userModel';
import { generateOTP } from '@src/library/otp';
import { sendmail } from '@src/library/mail';
import crypto from 'crypto';
import {OAuth2Client} from 'google-auth-library'


const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID)

// register
export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  // if (!firstName || !lastName || !email || !password) {
  //   return res.status(400).json({ success: false, message: 'First name, last name, email, and password are required.' });
  // }
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 *1000);
    const lastOtpSent = new Date();
    const user = new UserModel({ firstName, lastName, email, password: hashedPassword, otp, otpExpires, lastOtpSent });
    await user.save();

    await sendmail(
      email,
      'Your OTP Code',
      otp,
    );

    return res.status(201).json({ success: true, message: 'User registered successfully. OTP sent' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // if (!email || !password) {
  //   return res.status(400).json({ success: false, message: 'Email and password are required.' });
  // }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email with the OTP before logging in.' });
    }
    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Password is Incorrect.' });
    }
    const payload = {
      userId: user._id, 
      email: user.email
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true, 
    };
    user.password = undefined;
    return res.cookie('token', token, options).status(200).json({
      success: true,
      token,
      user,
      message: 'Logged in successfully.'
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// verify OTP
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } =req.body;
  // if(!email || !otp){
  //   return res.status(400).json({success: false, message: 'Email and Otp are required.'})
  // }
  try {
    const user = await UserModel.findOne({email});
    if(!user){
      return res.status(404).json({success: false, message: 'User not found.'});
    }
    if(!user.otp || !user.otpExpires){
      return res.status(400).json({succes: false, message: 'No OTP set for this user.'})
    }
    if(user.otp !== otp){
      return res.status(400).json({success: false, message: 'Invalid OTP.'});
    }
    if(user.otpExpires < new Date()){
      return res.status(400).json({success: false, message: 'OTP has expired.'});
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({success: true, message: 'OTP verified successfully.'});

  } catch(error){
    return res.status(500).json({success: false, message: 'Server error.', error})
  }
}

//forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  const {email} = req.body;
  // if(!email){
  //   return res.status(400).json({ success: false, message: 'Email is required.' });
  // }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: true, message: 'If that email is registered, a reset link has been sent. '});
    }
    const  token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    user.resetPasswordToken=token;
    user.resetPasswordTokenExpires=expires;
    await user.save();
    const resetLink = `http://localhost:3000/api/v1/auth/reset-password-form?token=${token}`;
    await sendmail(
      user.email,
      'Password Reset Request',
      `Click the link to reset your password: <a href='${resetLink}'>Reset Password</a><br/>If you did not request this, ignore this email.`
    );
    return res.status(200).json({ success: true, message: 'Password reset link sent to your registered email.' });
    } catch (error) {
    return res.status(500).json({success: false, message: 'Server error.', error})
  }
}

export const serveResetPasswordForm = async (req: Request, res: Response) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).send('Invalid or missing token.');
  }
  return res.send(`
    <html>
      <head><title>Reset Password</title></head>
      <body>
        <h2>Reset Your Password</h2>
        <form method="POST" action="/api/v1/auth/reset-password">
          <input type="hidden" name="token" value="${token}" />
          <label>New Password:</label><br />
          <input type="password" name="newPassword" required /><br />
          <label>Confirm Password:</label><br />
          <input type="password" name="confirmPassword" required /><br />
          <button type="submit">Reset Password</button>
        </form>
      </body>
    </html>
  `);
};

// reset password
export const resetPassword = async (req : Request, res: Response) => {
  const { token, newPassword, confirmPassword } = req.body;
  // if (!token || !newPassword || !confirmPassword) {
  //   return res.status(400).json({ success: false, message: 'Token, new password, and confirm password are required.' });
  // }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }
  try {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: new Date() }
    });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    try {
      await sendmail(
        user.email,
        'Password Reset Successful',
        'Your password has been reset successfully. If you did not perform this action, please contact support immediately.'
      );
    } catch (mailError) {
    }

    return res.status(200).json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.', error });
  }
};

export const sendResetPasswordEmail = async (user: any, req: Request) => {
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password-form?token=${user.resetPasswordToken}`;
  const message = `You requested a password reset. Click the link below to reset your password:\n\n<a href="${resetUrl}">${resetUrl}</a>\n\nIf you did not request this, please ignore this email.`;
  await sendmail(
    user.email,
    'Password Reset Request',
    message
  );
};

//resend OTP
export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({email});
    if (!user){
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    //check if user has a lastOtpSent
    if(user.lastOtpSent){
      const timeSinceLastOtp = Date.now() - user.lastOtpSent.getTime();
      const thirtySeconds = 30 * 1000;

      if(timeSinceLastOtp <  thirtySeconds){
        const remainingTime = Math.ceil((thirtySeconds - timeSinceLastOtp) / 1000);
        return res.status(429).json({ 
          success: false, 
          message: `Please wait ${remainingTime} seconds before requesting a new OTP.`,
          remainingTime 
        });
      }
    }

    //new Otp generate
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const lastOtpSent = new Date();

    //update user with new otp
    user.otp = otp;
    user.otpExpires = otpExpires;
    user.lastOtpSent = lastOtpSent;
    await user.save();

    //send new otp via email
    await sendmail(
      email,
      'Your New OTP Code',
      otp,
    );
    return res.status(200).json({ success: true, message: 'New OTP sent successfully.', nextResendTime: new Date(lastOtpSent.getTime() + 30 * 1000)});
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.', error });
  }
}

export const googleAuth = async (req:Request, res:Response) => {
  try {
    const {idToken} = req.body;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_WEB_CLIENT_ID
    })

    const payload = ticket.getPayload();
    if(!payload){
       return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    const {email, given_name, family_name} = payload;

    let user = await UserModel.findOne({email});
    if(!user){
      user = new UserModel({
        firstName:given_name,
        lastName:family_name,
        email,
        isVerified:true,
        isGoogleAccount:true,
      });
      await user.save();
    }

    const token = jwt.sign({userId:user._id, email:user.email}, process.env.JWT_SECRET!, {expiresIn:'24h'})

    return res.status(200).json({
      success:true,
      token,
      user
    })

  } catch (error) {
    console.log(error)
     return res.status(500).json({ success: false, message: 'Google login failed', error: error });
  }
}
