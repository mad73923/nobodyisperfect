let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const { expect } = require('chai');
let should = chai.should();

const state = require('../_helpers/gameState');

chai.use(chaiHttp);

const testAdminCredentials = {
    username: 'testadmin',
    password: 'test'
};

const testUserCredentials = {
    username: 'testuser',
    password: 'test'
};

const testGameCredentials = {
    username: 'testgame',
    password: 'test'
};

const mockGame = {
    name: 'top testgame'
}


describe('Game', () => {
    let adminToken = {};
    let userToken = {};
    let gameToken = {};

    before((done) => {
        // auth admin
        chai.request(server)
            .post('/users/authenticate')
            .send(testAdminCredentials)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                adminToken = { Authorization: `Bearer ${res.body.jwtToken}` };
            });
        chai.request(server)
        .post('/users/authenticate')
        .send(testUserCredentials)
        .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            userToken = { Authorization: `Bearer ${res.body.jwtToken}` };
        });
        chai.request(server)
        .post('/users/authenticate')
        .send(testGameCredentials)
        .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            gameToken = { Authorization: `Bearer ${res.body.jwtToken}` };
            done();
        });
    });

    let adminGame = {};
    let gameGame = {};

    describe('/POST', () => {
        it('it should add a new game as admin', (done) => {
            chai.request(server)
            .post('/game')
            .set(adminToken)
            .send(mockGame)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                adminGame = res.body;
                done();
            });
        });

        it('it should add a new game as gamemaster', (done) => {
            chai.request(server)
            .post('/game')
            .set(gameToken)
            .send(mockGame)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                gameGame = res.body;
                done();
            });
        });

        it('it should NOT add a new game as user', (done) => {
            chai.request(server)
            .post('/game')
            .set(userToken)
            .send(mockGame)
            .end((err, res) => {
                expect(res.statusCode).to.equal(401);
                done();
            });
        });
    });

    describe('/PUT', () => {
        it('modify the game state', (done) => {
            gameGame.currentState = state.Running;
            chai.request(server)
            .put('/game')
            .set(gameToken)
            .send(gameGame)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
        })
    });

    describe('/GET', () => {
        it('get games as user', (done) => {
            chai.request(server)
            .get('/game')
            .set(userToken)
            .end((err, res) => {
                expect(res.body.map(x => x._id).includes(adminGame._id)).to.equal(true);
                done();
            });
        });
        it('dont get games which are running', (done) => {
            chai.request(server)
            .get('/game')
            .set(userToken)
            .end((err, res) => {
                expect(res.body.map(x => x._id).includes(gameGame._id)).to.equal(false);
                done();
            });
        });
        it('as master get all games in every state', (done) => {
            chai.request(server)
            .get('/game')
            .set(gameToken)
            .end((err, res) => {
                expect(res.body.map(x => x._id).includes(gameGame._id)).to.equal(true);
                expect(res.body.map(x => x._id).includes(adminGame._id)).to.equal(true);
                done();
            });
        });
    });
});