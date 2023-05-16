import { Model, INTEGER, BOOLEAN } from 'sequelize';
import db from '.';
import TeamModel from './TeamModel';

class MatchModel extends Model {
  declare id: number;
  declare username: string;
  declare role: string;
  declare email: string;
  declare password: string;
}

MatchModel.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: INTEGER,
  },
  homeTeamId: {
    allowNull: false,
    type: INTEGER,
  },
  homeTeamGoals: {
    allowNull: false,
    type: INTEGER,
  },
  awayTeamId: {
    allowNull: false,
    type: INTEGER,
  },
  awayTeamGoals: {
    allowNull: false,
    type: INTEGER,
  },
  inProgress: {
    allowNull: false,
    type: BOOLEAN,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

MatchModel.belongsTo(TeamModel, { foreignKey: 'homeTeamId', as: 'id' });
MatchModel.belongsTo(TeamModel, { foreignKey: 'awayTeamId', as: 'id' });

TeamModel.hasMany(MatchModel, { foreignKey: 'id', as: 'homeTeamId' });
TeamModel.hasMany(MatchModel, { foreignKey: 'id', as: 'awayTeamId' });

export default MatchModel;
