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
};

const mockQuestion = {
    text: 'What makes you happy?',
    correctAnswer: 'Passing tests'
};

chai.use(chaiHttp);


describe('Question', () => {
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

    describe('/GET', () =>{
        it('it should GET all the questions', (done) => {
            chai.request(server)
                .get('/question')
                .set({ Authorization: `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    let addedQuestion = {};
    describe('/POST', () => {
        it('it should add a new question', (done) => {
            chai.request(server)
            .post('/question/add')
            .set({ Authorization: `Bearer ${token}` })
            .send(mockQuestion)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                addedQuestion = res.body;
                done();
            });
        });
    });
    describe('/PUT', () => {
        it('it should be possible to update a question', (done) => {
            addedQuestion.text = 'nonesense';
            chai.request(server)
            .put('/question')
            .set({ Authorization: `Bearer ${token}` })
            .send(addedQuestion)
            .end((err, res) => {
                //console.log(res);
                res.body.text.should.equal('nonesense');
                done();
            });
        });
    });
});
