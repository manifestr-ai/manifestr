import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: any, res: Response, next: NextFunction) => {
  if (!req.user?.is_admin) {
    return res.status(403).json({ message: 'Admin access only' });
  }

  next();
};