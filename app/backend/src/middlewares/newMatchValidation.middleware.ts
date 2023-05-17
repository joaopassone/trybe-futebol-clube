import { NextFunction, Request, Response } from 'express';
import TeamService from '../services/team.service';

export default async function newMatchValidation(req: Request, res: Response, next: NextFunction) {
  const { homeTeamId, awayTeamId } = req.body;

  if (homeTeamId === awayTeamId) {
    return res.status(422)
      .json({ message: 'It is not possible to create a match with two equal teams' });
  }

  const teamService = new TeamService();

  const homeTeam = await teamService.getById(+homeTeamId);
  const awayTeam = await teamService.getById(+awayTeamId);

  if (!homeTeam || !awayTeam) {
    return res.status(404)
      .json({ message: 'There is no team with such id!' });
  }

  next();
}
