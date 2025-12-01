import { Controller, Post, Body } from '@nestjs/common';
import { sendEmail } from '../utils/email';

@Controller('contact')
export class ContactController {
  @Post()
  async sendContact(
    @Body()
    data: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      message: string;
    }
  ) {
    const { firstName, lastName, email, phone, message } = data;

    // Email to Admin
    const adminHtml = `
      <h2>📩 New Contact Form Message</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await sendEmail(process.env.ADMIN_EMAIL!, "New Contact Form Message", adminHtml);

    // Confirmation to user
    const userHtml = `
      <h2>Thank You for Contacting Us! ❤️</h2>
      <p>Hi ${firstName},</p>
      <p>We received your message:</p>
      <blockquote>${message}</blockquote>
      <p>We will get back to you shortly.</p>
    `;

    await sendEmail(email, "We Received Your Message", userHtml);

    return { success: true, message: "Message sent successfully" };
  }
}
