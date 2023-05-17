import * as express from 'express';
import UserController from '../controllers/user.controller';
import userLoginValidation from '../middlewares/userLogin.middleware';
import tokenValidation from '../middlewares/tokenValidation.middleware';

export default class UserRouter {
  router: express.Router;
  controller: UserController;

  constructor() {
    this.router = express.Router();
    this.controller = new UserController();

    this.router.post('/', userLoginValidation, this.controller.login);
    this.router.get('/role', tokenValidation);
  }
}
