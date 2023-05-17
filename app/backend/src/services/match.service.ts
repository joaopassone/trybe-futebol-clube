import QueryString = require('qs');
import TeamModel from '../database/models/TeamModel';
import MatchModel from '../database/models/MatchModel';

class MatchService {
  constructor(public model = MatchModel) {}

  async getAllMatches(query: QueryString.ParsedQs) {
    let condition;

    if (query.inProgress === 'true' || query.inProgress === 'false') {
      const inProgress = query.inProgress === 'true';
      condition = { inProgress };
    }

    return this.model.findAll(
      {
        where: condition,
        include: [
          { model: TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
          { model: TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
        ],
      },
    );
  }

  async finishMatch(id: number) {
    return this.model.update({
      inProgress: false,
    }, {
      where: { id },
    });
  }

  async updateMatch(id: number, body: { homeTeamGoals: number, awayTeamGoals: number }) {
    const { homeTeamGoals, awayTeamGoals } = body;
    return this.model.update({
      homeTeamGoals,
      awayTeamGoals,
    }, {
      where: { id },
    });
  }
}

export default MatchService;
