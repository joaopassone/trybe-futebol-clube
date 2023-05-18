import { QueryTypes } from 'sequelize';
import Sequelize from '../database/models';
import getHomeLeaderboard from '../literals/getLeaderboard.home';
import getAwayLeaderboard from '../literals/getLeaderboard.away';
import MatchModel from '../database/models/MatchModel';

class LeaderboardService {
  constructor(public sequelize = Sequelize, public matchModel = MatchModel) {}

  async getHomeLeaderboard() {
    return this.sequelize.query(getHomeLeaderboard, { type: QueryTypes.SELECT });
  }

  async getAwayLeaderboard() {
    return this.sequelize.query(getAwayLeaderboard, { type: QueryTypes.SELECT });
  }
}

export default LeaderboardService;
