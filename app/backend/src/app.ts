import * as express from 'express';
import TeamRouter from './routers/teams.router';
import UserRouter from './routers/user.router';
import MatchRouter from './routers/match.router';
import LeaderboardRouter from './routers/leaderboard.router';

class App {
  public app: express.Express;
  private teamRouter: TeamRouter;
  private userRouter: UserRouter;
  private matchRouter: MatchRouter;
  private leaderboardRouter: LeaderboardRouter;

  constructor() {
    this.app = express();
    this.teamRouter = new TeamRouter();
    this.userRouter = new UserRouter();
    this.matchRouter = new MatchRouter();
    this.leaderboardRouter = new LeaderboardRouter();

    this.config();

    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));

    this.app.use('/teams', this.teamRouter.router);
    this.app.use('/login', this.userRouter.router);
    this.app.use('/matches', this.matchRouter.router);
    this.app.use('/leaderboard', this.leaderboardRouter.router);
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
