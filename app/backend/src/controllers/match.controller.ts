import { Request, Response } from 'express';
import MatchService from '../services/match.service';

class MatchController {
  constructor(public service = new MatchService()) {
    this.getAllMatches = this.getAllMatches.bind(this);
  }

  async getAllMatches(_req: Request, res: Response): Promise<void> {
    const matches = await this.service.getAllMatches();
    res.status(200).json(matches);
  }
}

export default MatchController;
