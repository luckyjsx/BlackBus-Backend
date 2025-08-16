import { User } from '@src/types';
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends User, Document {}

const UserSchema: Schema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
  type: String,
  required: function() {
    return !this.isGoogleAccount; // only require password for non-Google users
  }
},
  otp: {type: String},
  otpExpires: { type: Date },
  resetPasswordToken: {type: String},
  resetPasswordTokenExpires: {type: Date},
  lastOtpSent: { type: Date },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isGoogleAccount: { type: Boolean, default: false }
});

const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;