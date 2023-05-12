import TeamModel from '../database/models/TeamModel';

class TeamService {
  constructor(public model = TeamModel) {}

  async getAll() {
    return this.model.findAll();
  }

  async getById(id: number) {
    return this.model.findOne({ where: { id } });
  }
}

export default TeamService;
