import dotenv from 'dotenv';
dotenv.config();

export const mailConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  user: process.env.SMTP_USERNAME,
  pass: process.env.SMTP_PASSWORD
};
