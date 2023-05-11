import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/TeamModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes do Fluxo de Times', () => {

  let chaiHttpResponse: Response;

  const mockTeams = [
    { id: 1, teamName: 'Avaí/Kindermann' },
    { id: 2, teamName: 'Bahia' },
    { id: 3, teamName: 'Botafogo' },
    { id: 4, teamName: 'Corinthians' },
    { id: 5, teamName: 'Cruzeiro' },
  ];

  before(async () => {
    sinon
      .stub(Team, "findAll")
      .resolves(mockTeams as Team[]);
  });

  after(() => {
    (Team.findAll as sinon.SinonStub).restore();
  });

  it('Verifica se retorna o valor correto ao buscar todos os times:', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/teams');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body.teams).to.be.deep.equal(mockTeams);
  });
});
