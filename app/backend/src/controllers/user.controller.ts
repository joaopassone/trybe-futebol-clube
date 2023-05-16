import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
import UserService from '../services/user.service';
import UserLogin from '../interfaces/UserLogin';

class UserController {
  constructor(public service = new UserService()) {
    this.login = this.login.bind(this);
  }

  async login(req: Request, res: Response): Promise<void | Response> {
    const userLogin: UserLogin = req.body;
    const userData = await this.service.login(userLogin);

    if (!userData) return res.status(401).json();

    if (compareSync(userLogin.password, userData.password)) {
      const token = jwt.sign(
        {
          id: userData.id,
          username: userData.username,
          role: userData.role,
          email: userData.email,
        },
        process.env.JWT_SECRET as string,
      );

      return res.status(200).json({ token });
    }

    res.status(401).json();
  }
}

export default UserController;
