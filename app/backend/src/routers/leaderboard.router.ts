import * as express from 'express';
import LeaderboardController from '../controllers/leaderboard.controller';

export default class LeaderboardRouter {
  router: express.Router;
  controller: LeaderboardController;

  constructor() {
    this.router = express.Router();
    this.controller = new LeaderboardController();

    this.router.get('/', this.controller.getLeaderboard);
    this.router.get('/home', this.controller.getHomeLeaderboard);
    this.router.get('/away', this.controller.getAwayLeaderboard);
  }
}
