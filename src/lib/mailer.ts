import nodemailer from 'nodemailer';
import { mailConfig } from '../config/mailConfig';


const transport = nodemailer.createTransport({
  host: `${mailConfig.host}`,
  port: mailConfig.port,
  auth: {
    user: mailConfig.user, 
    pass: mailConfig.pass
  }
});

export const sendResetPasswordMail = async (otp: string, email: string) => { 
  try {
    console.log(mailConfig.pass, mailConfig.user, email)
    await transport.sendMail({
      from: `"Yatra" <${process.env.EMAIL_USER}>`, 
      to: `${email}`,
      subject: "OTP for resetting password",
      text: `Your OTP is: ${otp}`,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed");
  }
};
