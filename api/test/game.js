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
            gameGame.currentState = state.ReadQuestion;
            chai.request(server)
            .put('/game')
            .set(gameToken)
            .send(gameGame)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it('modify the game state as admin', (done) => {
            gameGame.currentState = state.ReadQuestion;
            chai.request(server)
            .put('/game')
            .set(adminToken)
            .send(adminGame)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it('users may NOT modify the game state', (done) => {
            gameGame.currentState = state.Finished;
            chai.request(server)
            .put('/game')
            .set(userToken)
            .send(gameGame)
            .end((err, res) => {
                expect(res.statusCode).to.equal(401);
                done();
            });
        });

        it('users should be able to join game', (done) => {
            chai.request(server)
            .put(`/game/join/${gameGame._id}`)
            .set(userToken)
            .send(gameGame)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });

        it('users should be able to join ONLY ONE game (except if they are finished');
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
        it('as user: dont get games which are running and they are not part of the game', (done) => {
            // todo this has to be reviewed!
            chai.request(server)
            .get('/game')
            .set(userToken)
            .end((err, res) => {
                expect(res.body.map(x => x._id).includes(gameGame._id)).to.equal(true);
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
        it('user get games in every state by Id', (done) => {
            chai.request(server)
            .get(`/game/${gameGame._id}`)
            .set(userToken)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
        });
    });

    describe('/DELETE', () => {
        it('users may NOT delete a game ', (done) => {
            gameGame.currentState = state.Finished;
            chai.request(server)
            .delete(`/game/${gameGame._id}`)
            .set(userToken)
            .end((err, res) => {
                expect(res.statusCode).to.equal(401);
                done();
            });
        });
        it('masters may not delete games from others', (done) => {
            chai.request(server)
            .delete(`/game/${adminGame._id}`)
            .set(gameToken)
            .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                done();
            });
        });
        it('masters may delete their own games', (done) => {
            chai.request(server)
            .delete(`/game/${gameGame._id}`)
            .set(gameToken)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it('admin delete games', (done) => {
            chai.request(server)
            .delete(`/game/${adminGame._id}`)
            .set(adminToken)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });

    describe('Gameflow', () => {
        it('gamemaster shall be able to create new round');
        it('admin shall be able to create new round');
        it('user shall not be able to create new round');
        it('gamemaster shall be able to change game state');

        it('gamemaster shall be able to create new round');
        it('gamemaster shall be able to change question of round');
        it('next reader shall be picked automatically');
        it('next reader shall be picked automatically');

    });

    describe('Answering', () => {
        it('only one answer per round and player (if multi-answer disabled)');
        it('reader may not hand in answer (if reader mode enabled)');
        it('if all players handed in their answer, the game state shall change to pick question');
    });

    describe('Pick answer', () => {
        it('only one pick per round and player');
        it('if all answers picked, change game state to ranking');
        it('reader may not pick answer (if reader mode enabled)');

    });
});
