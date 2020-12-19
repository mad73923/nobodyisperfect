const User = require('../users/user.model');
const Question = require('../question/question.model');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const { expect } = require('chai');
let should = chai.should();

const testUserCredentials = {
    username: 'test',
    password: 'test'
}

chai.use(chaiHttp);


describe('User', () => {
    let token = '';

    before((done) => {
        chai.request(server)
            .post('/users/authenticate')
            .send(testUserCredentials)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                token = res.body.jwtToken;
                done();
            });
    });

    describe('wrong credentials', () => {
        it('it should block wrong credentials (password)', (done) => {
            chai.request(server)
                .post('/users/authenticate')
                .send({username: 'test', password: 'test1'})
                .end((err, res) => {
                    expect(res.statusCode).to.equal(400);
                    done();
                })
        });
        it('it should block wrong credentials (username)', (done) => {
            chai.request(server)
                .post('/users/authenticate')
                .send({username: 'test1', password: 'test'})
                .end((err, res) => {
                    expect(res.statusCode).to.equal(400);
                    done();
                })
        });
    });
});
