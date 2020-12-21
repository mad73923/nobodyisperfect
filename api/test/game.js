const User = require('../users/user.model');
const Question = require('../question/question.model');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const { expect } = require('chai');
let should = chai.should();

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

    describe('/POST', () => {
        it('it should add a new game as admin', (done) => {
            chai.request(server)
            .post('/game')
            .set(adminToken)
            .send(mockGame)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                addedQuestionAdmin = res.body;
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
                addedQuestionAdmin = res.body;
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
                addedQuestionAdmin = res.body;
                done();
            });
        });
    });
});