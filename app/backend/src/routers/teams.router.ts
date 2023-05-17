import * as express from 'express';
import TeamController from '../controllers/team.controller';

export default class TeamRouter {
  router: express.Router;
  controller: TeamController;

  constructor() {
    this.router = express.Router();
    this.controller = new TeamController();

    this.router.get('/', this.controller.getAll);
    this.router.get('/:id', this.controller.getById);
  }
}
