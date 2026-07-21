// models/otp.model.ts
export interface VerifyOtpModel {
  userID:  number;
  otpCode: string;
}

export interface ResendOtpModel {
  userID: number;
}