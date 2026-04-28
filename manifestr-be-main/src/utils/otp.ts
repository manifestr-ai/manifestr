import crypto from "crypto";

export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

export const hashOTP = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};
export const getExpiryTime = (): string => {
  return new Date(Date.now() + 5 * 60 * 1000).toISOString(); // +5 minutes
};
