export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string | undefined;
  otp: string | undefined;
  otpExpires: Date | undefined;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  lastOtpSent?: Date | undefined;
}
