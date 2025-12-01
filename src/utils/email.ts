import * as dotenv from 'dotenv';
dotenv.config();  

import nodemailer from "nodemailer";

console.log("EMAIL_USER:", process.env.EMAIL_USER, "EMAIL_PASS:", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,          // Use 465 for SSL
  secure: true,       // true because port 465 uses SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
  logger: true,       // Logs SMTP communication (useful for debugging)
  debug: true,        // Show debug messages
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};
