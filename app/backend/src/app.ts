import * as express from 'express';
import TeamController from './controllers/team.controller';
import UserController from './controllers/user.controller';
import userLoginValidation from './middlewares/userLogin.middleware';

class App {
  public app: express.Express;
  private teamController: TeamController;
  private userController: UserController;

  constructor() {
    this.app = express();
    this.teamController = new TeamController();
    this.userController = new UserController();

    this.config();

    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));
    this.app.get('/teams', this.teamController.getAll);
    this.app.get('/teams/:id', this.teamController.getById);

    this.app.post('/login', userLoginValidation, this.userController.login);
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// Essa segunda exportação é estratégica, e a execução dos testes de cobertura depende dela
export const { app } = new App();
