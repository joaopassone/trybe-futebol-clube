import { Request, Response } from 'express';
import TeamService from '../services/team.service';

class TeamController {
  constructor(public service = new TeamService()) {
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    const teams = await this.service.getAll();
    res.status(200).json(teams);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const team = await this.service.getById(+id);
    res.status(200).json(team);
  }
}

export default TeamController;
