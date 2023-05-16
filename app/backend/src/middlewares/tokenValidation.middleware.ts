import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export default function tokenValidation(req: Request, res: Response) {
  const token = req.header('authorization');

  if (!token) return res.status(401).json({ message: 'Token not found' });

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    const { role } = jwt.decode(token) as jwt.JwtPayload;
    return res.status(200).json({ role });
  } catch (error) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
}
