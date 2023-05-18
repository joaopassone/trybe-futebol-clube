import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboard.service';

class LeaderboardController {
  constructor(public service = new LeaderboardService()) {
    this.getHomeLeaderboard = this.getHomeLeaderboard.bind(this);
    this.getAwayLeaderboard = this.getAwayLeaderboard.bind(this);
    this.getLeaderboard = this.getLeaderboard.bind(this);
  }

  async getHomeLeaderboard(_req: Request, res: Response): Promise<void> {
    const leaderboard = await this.service.getHomeLeaderboard();
    res.status(200).json(leaderboard);
  }

  async getAwayLeaderboard(_req: Request, res: Response): Promise<void> {
    const leaderboard = await this.service.getAwayLeaderboard();
    res.status(200).json(leaderboard);
  }

  async getLeaderboard(_req: Request, res: Response): Promise<void> {
    const leaderboard = await this.service.getLeaderboard();
    res.status(200).json(leaderboard);
  }
}

export default LeaderboardController;
