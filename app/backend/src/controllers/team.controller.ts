import { Request, Response } from 'express';
import TeamService from '../services/team.service';

class TeamController {
  constructor(public service = new TeamService()) {
    this.getAll = this.getAll.bind(this);
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    const teams = await this.service.getAll();
    res.status(200).json(teams);
  }
}

export default TeamController;
