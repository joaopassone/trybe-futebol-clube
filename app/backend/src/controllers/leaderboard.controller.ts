import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboard.service';

class LeaderboardController {
  constructor(public service = new LeaderboardService()) {
    this.getLeaderboard = this.getLeaderboard.bind(this);
  }

  async getLeaderboard(_req: Request, res: Response): Promise<void> {
    const leaderboard = await this.service.getLeaderboard();
    res.status(200).json(leaderboard);
  }
}

export default LeaderboardController;
