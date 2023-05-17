import * as express from 'express';
import tokenValidation from '../middlewares/tokenValidation.middleware';
import newMatchValidation from '../middlewares/newMatchValidation.middleware';
import MatchController from '../controllers/match.controller';

export default class MatchRouter {
  router: express.Router;
  controller: MatchController;

  constructor() {
    this.router = express.Router();
    this.controller = new MatchController();

    this.router.get('/', this.controller.getAllMatches);
    this.router.patch('/:id/finish', tokenValidation, this.controller.finishMatch);
    this.router.patch('/:id', tokenValidation, this.controller.updateMatch);
    this.router.post('/', tokenValidation, newMatchValidation, this.controller.createNewMatch);
  }
}
