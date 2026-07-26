import { Response } from 'express';
export const sendSuccess = (res: Response, data: any, statusCode = 200, message = 'Success') => {
  res.status(statusCode).json({ success: true, message, ...data });
};
export const sendError = (res: Response, message: string, statusCode = 400) => {
  res.status(statusCode).json({ success: false, message });
};
