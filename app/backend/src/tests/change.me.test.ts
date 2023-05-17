import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';
import UserModel from '../database/models/UserModel';
import MatchModel from '../database/models/MatchModel';

import { Response } from 'superagent';
import * as jwt from 'jsonwebtoken';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes de integração', () => {

  describe('Testes do Fluxo de Times:', () => {

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
        .stub(TeamModel, "findAll")
        .resolves(mockTeams as TeamModel[]);

      sinon
        .stub(TeamModel, "findOne")
        .resolves(mockTeams[0] as TeamModel);
    });

    after(() => {
      (TeamModel.findAll as sinon.SinonStub).restore();
      (TeamModel.findOne as sinon.SinonStub).restore();
    });

    it('Verifica se retorna o valor correto ao buscar todos os times', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/teams');

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(mockTeams);
    });

    it('Verifica se retorna o valor correto ao buscar por um time apenas', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/teams/1');

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(mockTeams[0]);
    });
  });

  describe('Testes do Fluxo de Pessoas Usuárias e Acesso:', () => {

    let chaiHttpResponse: Response;

    const mockUsers = [
      {
        username: 'Admin',
        role: 'admin',
        email: 'admin@admin.com',
        password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
          // senha: secret_admin
      },
      {
        username: 'User',
        role: 'user',
        email: 'user@user.com',
        password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO', 
          // senha: secret_user
      },
      // os logins abaixo são intencionalmente inválidos, pois serão usados nos testes
      {
        username: 'User',
        role: 'user',
        email: '@user.com',
        password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO', 
          // senha: secret_user
      },
      {
        username: 'User',
        role: 'user',
        email: 'invalid.user@user.com',
        password: '$2a$10$HDkFwOMKOI6PTza0F7.YRu1Bqsqb9hx7XkuV7QeYB5dRL4z9DI1Mu',
        // senha: 12345
      },
    ];

    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjU0NTI3MTg5fQ.XS_9AA82iNoiVaASi0NtJpqOQ_gHSHhxrpIdigiT-fc';

    before(async () => {
      sinon
        .stub(UserModel, "findOne")
        .resolves({ id: 1, ...mockUsers[0] } as UserModel);
      sinon
        .stub(jwt, "sign")
        .callsFake(() => mockToken);
    });

    after(() => {
      (UserModel.findOne as sinon.SinonStub).restore();
      (jwt.sign as sinon.SinonStub).restore();
    });

    it('Verifica se permite fazer login ao entrar com dados válidos', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@admin.com', password: 'secret_admin' });

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal({ token: mockToken });
    });

    it('Verifica se permite fazer login ao não informar um email', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ password: 'secret_admin' });

      expect(chaiHttpResponse.status).to.be.equal(400);
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'All fields must be filled' });
    });

    it('Verifica se permite fazer login ao não informar uma senha', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@admin.com' });

      expect(chaiHttpResponse.status).to.be.equal(400);
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'All fields must be filled' });
    });

    it('Verifica se permite fazer login ao informar um email com formato inválido', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: '@admin.com', password: 'secret_admin' });

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'Invalid email or password' });

      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin.admin.com', password: 'secret_admin' });

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'Invalid email or password' });

      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@admin', password: 'secret_admin' });

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'Invalid email or password' });

      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@.com', password: 'secret_admin' });

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'Invalid email or password' });
    });

    it('Verifica se permite fazer login ao informar um email não cadastrado', async () => {
      (UserModel.findOne as sinon.SinonStub).restore();

      sinon
        .stub(UserModel, "findOne")
        .resolves(null);

      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'notadmin@admin.com', password: 'secret_admin' });

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'Invalid email or password' });
    });

    it('Verifica se permite fazer login ao entrar com senha incorreta', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@admin.com', password: 'secret_notadmin' });

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'Invalid email or password' });
    });

    it('Verifica se permite fazer login ao entrar com senha inválida', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@admin.com', password: '12345' });

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'Invalid email or password' });
    });

    it('Verifica se permite acessar login/role sem um token', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/login/role');

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'Token not found' });
    });

    it('Verifica se permite acessar login/role sem um token válido', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/login/role')
        .auth('authorization', 'invalid-token');

      expect(chaiHttpResponse.status).to.be.equal(401);
      expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'Token must be a valid token' });
    });

    it('Verifica se permite acessar login/role com um token válido', async () => {
      sinon
        .stub(jwt, "verify")
        .callsFake(() => true);

      const { body } = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@admin.com', password: 'secret_admin' });

      chaiHttpResponse = await chai
        .request(app)
        .get('/login/role')
        .set('authorization', body.token);

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal({ role: 'admin' });

      (jwt.verify as sinon.SinonStub).restore();
    });
  });

  describe('Testes do Fluxo de Partidas:', () => {

    let chaiHttpResponse: Response;

    const mockMatches = [
      {
        id: 1,
        homeTeamId: 16,
        homeTeamGoals: 1,
        awayTeamId: 8,
        awayTeamGoals: 1,
        inProgress: false,
        homeTeam: {
          teamName: "São Paulo"
        },
        awayTeam: {
          teamName: "Grêmio"
        }
      },
      {
        id: 41,
        homeTeamId: 16,
        homeTeamGoals: 2,
        awayTeamId: 9,
        awayTeamGoals: 0,
        inProgress: true,
        homeTeam: {
          teamName: "São Paulo"
        },
       awayTeam: {
          teamName: "Internacional"
        }
      }
    ];

    before(() => {
      sinon
        .stub(MatchModel, "findAll")
        .resolves(mockMatches as MatchModel[]);
    });

    after(() => {
      (MatchModel.findAll as sinon.SinonStub).restore();
    });

    it('Verifica se o endpoint /matches retorna todas as partidas corretamente', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/matches');

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal(mockMatches);
    });

    it('Verifica se o endpoint /matches retorna as partidas filtradas por inProgress corretamente', async () => {
      chaiHttpResponse = await chai
        .request(app)
        .get('/matches?inProgress=true');

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal([mockMatches[1]]);

      chaiHttpResponse = await chai
        .request(app)
        .get('/matches?inProgress=false');

      expect(chaiHttpResponse.status).to.be.equal(200);
      expect(chaiHttpResponse.body).to.be.deep.equal([mockMatches[0]]);
    });
  });
});
