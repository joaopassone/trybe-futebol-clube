import { Request, Response } from 'express';
import MatchService from '../services/match.service';

class MatchController {
  constructor(public service = new MatchService()) {
    this.getAllMatches = this.getAllMatches.bind(this);
    this.finishMatch = this.finishMatch.bind(this);
    this.updateMatch = this.updateMatch.bind(this);
    this.createNewMatch = this.createNewMatch.bind(this);
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

  async updateMatch(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { body } = req;
    await this.service.updateMatch(+id, body);
    res.status(200).json({ message: 'Match updated' });
  }

  async createNewMatch(req: Request, res: Response): Promise<void> {
    const { body } = req;
    const newMatch = await this.service.createNewMatch(body);
    res.status(201).json(newMatch);
  }
}

export default MatchController;
