import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1] : null;
    if (!token) return res.status(401).json({ success: false, message: 'Access denied. No token.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string; email: string };
    const user = await User.findById(decoded.id).select('_id role email isActive');
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: 'User not found or deactivated.' });
    req.user = { id: user._id.toString(), role: user.role, email: user.email };
    next();
  } catch { res.status(401).json({ success: false, message: 'Invalid or expired token.' }); }
};

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string; email: string };
      req.user = decoded;
    }
  } catch (_) {}
  next();
};

export const authorize = (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role))
    return res.status(403).json({ success: false, message: 'Forbidden. Insufficient permissions.' });
  next();
};

export const isAdmin = authorize('admin', 'super_admin');
export const isSuperAdmin = authorize('super_admin');
