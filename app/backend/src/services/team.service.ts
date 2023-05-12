import TeamModel from '../database/models/TeamModel';

class TeamService {
  constructor(public model = TeamModel) {}

  async getAll() {
    return this.model.findAll();
  }
}

export default TeamService;
