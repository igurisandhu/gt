import twilio from "twilio";
import { setRedisDataWithExpiry } from "../databases/redis";

const sendPhoneOTPUtility = async (phone: string) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);

    await setRedisDataWithExpiry(phone, otp.toString(), 60 * 5); //expiring in 5 minutes
    await setRedisDataWithExpiry(phone + "_fail", 0, 60 * 5);
    const message = `Your OTP is ${otp}`;
    const response = await sendSMS(phone, message);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error sending OTP");
  }
};

const sendSMS = async (phone: string, message: string) => {
  try {
    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_PHONE_NUMBER
    ) {
      throw new Error("Twilio credentials not found");
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error sending SMS");
  }
};

export { sendPhoneOTPUtility, sendSMS };
