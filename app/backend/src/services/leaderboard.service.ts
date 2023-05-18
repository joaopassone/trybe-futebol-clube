import { QueryTypes } from 'sequelize';
import Sequelize from '../database/models';
import getLeaderboard from '../literals/getLeaderboard.home';
import MatchModel from '../database/models/MatchModel';

class LeaderboardService {
  constructor(public sequelize = Sequelize, public matchModel = MatchModel) {}

  async getLeaderboard() {
    return this.sequelize.query(getLeaderboard, { type: QueryTypes.SELECT });
  }
}

export default LeaderboardService;
