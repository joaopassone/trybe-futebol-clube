import UserLogin from '../interfaces/UserLogin';
import UserModel from '../database/models/UserModel';

class UserService {
  constructor(public model = UserModel) {}

  async login(userLogin: UserLogin) {
    return this.model.findOne({ where: { email: userLogin.email } });
  }
}

export default UserService;
