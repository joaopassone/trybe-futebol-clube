import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';
import UserModel from '../database/models/UserModel';

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

    beforeEach(async () => {
      sinon
        .stub(TeamModel, "findAll")
        .resolves(mockTeams as TeamModel[]);

      sinon
        .stub(TeamModel, "findOne")
        .resolves(mockTeams[0] as TeamModel);
    });

    afterEach(() => {
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

    beforeEach(async () => {
      sinon
        .stub(UserModel, "findOne")
        .resolves({ id: 1, ...mockUsers[0] } as UserModel);
      sinon
        .stub(jwt, "sign")
        .callsFake(() => mockToken);
    });

    afterEach(() => {
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
  });
});
