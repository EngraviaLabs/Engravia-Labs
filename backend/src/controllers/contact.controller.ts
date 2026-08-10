import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';
import emailService from '../services/email.service';

export const submitContactForm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return next(new AppError('Name, email, subject, and message are required fields.', 400));
    }

    const cleanEmail = String(email).trim().toLowerCase();
    await emailService.sendContactFormSubmission({
      name: String(name).trim(),
      email: cleanEmail,
      phone: phone ? String(phone).trim() : undefined,
      subject: String(subject).trim(),
      message: String(message).trim(),
    });

    res.status(200).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received and our team will get back to you within 24 hours.',
    });
  } catch (e) {
    next(e);
  }
};
