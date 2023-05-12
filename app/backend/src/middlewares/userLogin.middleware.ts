import { NextFunction, Request, Response } from 'express';

export default function userLoginValidation(req: Request, res: Response, next: NextFunction) {
  const userLogin = req.body;
  const { email, password } = userLogin;

  if (!email || !password) return res.status(400).json({ message: 'All fields must be filled' });

  next();
}
