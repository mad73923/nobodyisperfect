const User = require('../users/user.model');
const Question = require('../question/question.model');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const { expect } = require('chai');
let should = chai.should();

const testAdminCredentials = {
    username: 'testadmin',
    password: 'test'
};

const testUserCredentials = {
    username: 'testuser',
    password: 'test'
};

const mockQuestion = {
    text: 'What makes you happy?',
    correctAnswer: 'Passing tests'
};

chai.use(chaiHttp);


describe('Question', () => {
    let adminToken = {};
    let userToken = {};

    before((done) => {
        // clear database
        Question.deleteMany({}).exec();
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
            done();
        });
    });

    describe('/GET', () =>{
        it('it should GET all the questions', (done) => {
            chai.request(server)
                .get('/question')
                .set(adminToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        it('normal users should not get all questions', (done) =>{
            chai.request(server)
                .get('/question')
                .set(userToken)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    let addedQuestionAdmin = {};
    let addedQuestionUser = {};
    describe('/POST', () => {
        it('it should add a new question as admin', (done) => {
            chai.request(server)
            .post('/question/add')
            .set(adminToken)
            .send(mockQuestion)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                addedQuestionAdmin = res.body;
                done();
            });
        });
        it('it should add a new question as user', (done) => {
            chai.request(server)
            .post('/question/add')
            .set(userToken)
            .send(mockQuestion)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                addedQuestionUser = res.body;
                done();
            });
        });
    });

    describe('/PUT', () => {
        it('it should be possible to update a question', (done) => {
            addedQuestionAdmin.text = 'nonesense';
            chai.request(server)
            .put('/question')
            .set(adminToken)
            .send(addedQuestionAdmin)
            .end((err, res) => {
                res.body.text.should.equal('nonesense');
                done();
            });
        });
        it('it should be possible for admins to update any question', (done) => {
            addedQuestionUser.text = 'nonesense';
            addedQuestionUser.accepted = true;
            chai.request(server)
            .put('/question')
            .set(adminToken)
            .send(addedQuestionUser)
            .end((err, res) => {
                res.body.text.should.equal('nonesense');
                res.status.should.equal(200);
                done();
            });
        });
        it('normal users shall not be able to edit others questions', (done) => {
            addedQuestionAdmin.text = 'more nonesense';
            chai.request(server)
            .put('/question')
            .set(userToken)
            .send(addedQuestionAdmin)
            .end((err, res) => {
                res.status.should.equal(400);
                done();
            });
        });
        it('when users change their question, it should should change its state to unaccepted', (done) => {
            addedQuestionUser.text = 'even more nonesense';
            chai.request(server)
            .put('/question')
            .set(userToken)
            .send(addedQuestionUser)
            .end((err, res) => {
                res.status.should.equal(200);
                res.body.accepted.should.equal(false);
                done();
            });
        });
    });

    describe('/DELETE', () => {
        it('it should not be impossible to delete non-valid question ids', (done) => {
            chai.request(server)
            .delete(`/question/abcdef`)
            .set(adminToken)
            .end((err, res) => {
                expect(res.statusCode).to.equal(500);
                done();
            });
        });

        it('it should be possible to delete a question by ID', (done) => {
            chai.request(server)
            .delete(`/question/${addedQuestionAdmin._id}`)
            .set(adminToken)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body.message).to.equal('Question deleted');
                done();
            });
        });

        it('users shall be able to delete their own questions by ID', (done) => {
            chai.request(server)
            .delete(`/question/${addedQuestionUser._id}`)
            .set(userToken)
            .end((err, res) => {
                //console.log(res.body);
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });
});
