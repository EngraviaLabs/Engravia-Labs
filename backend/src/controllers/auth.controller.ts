import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import emailService from '../services/email.service';

const signAccess = (id: string, role: string, email: string) =>
  jwt.sign({ id, role, email }, process.env.JWT_SECRET!, { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any });

const signRefresh = (id: string) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' });

const sendTokens = (res: Response, user: any, statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    accessToken: signAccess(user._id, user.role, user.email),
    refreshToken: signRefresh(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified, avatar: user.avatar },
  });

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!email || !phone) return next(new AppError('Both email and phone number are required for registration.', 400));
    if (await User.findOne({ email })) return next(new AppError('Email already registered.', 409));
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.create({ name, email, phone, password, otp: { code: otp, expiresAt: new Date(Date.now() + 10 * 60000) } });
    await emailService.sendOTP(email, name, otp);
    res.status(201).json({ success: true, message: 'Registration successful. Check your email for the OTP.', userId: user._id });
  } catch (e) { next(e); }
};

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId).select('+otp');
    if (!user) return next(new AppError('User not found.', 404));
    if (user.isVerified) return next(new AppError('Already verified.', 400));
    if (!user.otp || user.otp.code !== otp || user.otp.expiresAt < new Date())
      return next(new AppError('Invalid or expired OTP.', 400));
    user.isVerified = true; user.otp = undefined;
    await user.save();
    sendTokens(res, user);
  } catch (e) { next(e); }
};

export const resendOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return next(new AppError('User not found.', 404));
    if (user.isVerified) return next(new AppError('Already verified.', 400));
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60000) };
    await user.save({ validateBeforeSave: false });
    await emailService.sendOTP(user.email, user.name, otp);
    res.json({ success: true, message: 'OTP resent successfully.' });
  } catch (e) { next(e); }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isActive: true }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return next(new AppError('Invalid email or password.', 401));
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    sendTokens(res, user);
  } catch (e) { next(e); }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return next(new AppError('Refresh token required.', 400));
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) return next(new AppError('User not found.', 401));
    res.json({ success: true, accessToken: signAccess(user._id.toString(), user.role, user.email) });
  } catch { next(new AppError('Invalid refresh token.', 401)); }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = { code: otp, expiresAt: new Date(Date.now() + 15 * 60000) };
      await user.save({ validateBeforeSave: false });
      await emailService.sendPasswordResetOTP(user.email, user.name, otp);
    }
    res.json({ success: true, message: 'If that email exists, an OTP was sent.', userId: user?._id });
  } catch (e) { next(e); }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, otp, newPassword } = req.body;
    const user = await User.findById(userId).select('+otp');
    if (!user) return next(new AppError('User not found.', 404));
    if (!user.otp || user.otp.code !== otp || user.otp.expiresAt < new Date())
      return next(new AppError('Invalid or expired OTP.', 400));
    user.password = newPassword; user.otp = undefined;
    await user.save();
    await emailService.sendPasswordChangedNotification(user.email, user.name);
    res.json({ success: true, message: 'Password reset successfully.' });
  } catch (e) { next(e); }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id)
      .populate('wishlist', 'name slug images price salePrice rating');
    if (!user) return next(new AppError('User not found.', 404));
    res.json({ success: true, user });
  } catch (e) { next(e); }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user!.id).select('+password');
    if (!user || !(await user.comparePassword(currentPassword)))
      return next(new AppError('Current password is incorrect.', 401));
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (e) { next(e); }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const update: any = {};
    if (req.body.name) update.name = req.body.name;
    if (req.body.phone) update.phone = req.body.phone;
    if (req.file) update.avatar = (req.file as any).path;
    const user = await User.findByIdAndUpdate(req.user!.id, update, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (e) { next(e); }
};

export const addAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) return next(new AppError('User not found.', 404));
    if (req.body.isDefault) user.addresses.forEach(a => { a.isDefault = false; });
    user.addresses.push(req.body);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (e) { next(e); }
};

export const updateAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) return next(new AppError('User not found.', 404));
    const addr = (user.addresses as any).id(req.params.addressId);
    if (!addr) return next(new AppError('Address not found.', 404));
    if (req.body.isDefault) user.addresses.forEach(a => { a.isDefault = false; });
    Object.assign(addr, req.body);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (e) { next(e); }
};

export const deleteAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) return next(new AppError('User not found.', 404));
    user.addresses = user.addresses.filter(a => a._id!.toString() !== req.params.addressId) as any;
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (e) { next(e); }
};
