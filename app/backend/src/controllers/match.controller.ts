import { Request, Response } from 'express';
import MatchService from '../services/match.service';

class MatchController {
  constructor(public service = new MatchService()) {
    this.getAllMatches = this.getAllMatches.bind(this);
    this.finishMatch = this.finishMatch.bind(this);
  }

  async getAllMatches(req: Request, res: Response): Promise<void> {
    const { query } = req;
    const matches = await this.service.getAllMatches(query);
    res.status(200).json(matches);
  }

  async finishMatch(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.service.finishMatch(+id);
    res.status(200).json({ message: 'Finished' });
  }
}

export default MatchController;
