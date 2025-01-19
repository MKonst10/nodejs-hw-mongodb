import nodemailer from "nodemailer";
import "dotenv/config";

const { SMTP_PASSWORD, SMTP_USER, SMTP_FROM, SMTP_HOST } = process.env;

const nodemailerConfig = {
  host: SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = (dat) => {
  const email = { ...dat, form: SMTP_FROM };
  return transporter.sendMail(email);
};
