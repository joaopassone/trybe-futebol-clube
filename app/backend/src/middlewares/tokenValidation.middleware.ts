import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export default function tokenValidation(req: Request, res: Response, next: NextFunction) {
  const token = req.header('authorization');

  if (!token) return res.status(401).json({ message: 'Token not found' });

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);

    if (req.originalUrl === '/login/role') {
      const { role } = jwt.decode(token) as jwt.JwtPayload;
      return res.status(200).json({ role });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
}
