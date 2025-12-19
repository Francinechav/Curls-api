import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP VERIFY ERROR:", err);
  } else {
    console.log("✅ SMTP READY");
  }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"CINE PIXEL DESIGNS" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent:", info.response);
  } catch (err) {
    console.error("❌ SENDMAIL ERROR:", err);
  }
};
