const express = require('express');
const router = express.Router();
const authorize = require('_middleware/authorize')
const questionService = require('./question.service');
const Role = require('_helpers/role');
const { func } = require('@hapi/joi');

router.post('/add', authorize(), addNewQuestion)
router.get('/', authorize(Role.Admin), getAll)
router.get('/my', authorize(), getMy)
router.get('/:id', authorize(), getById)
router.put('/', authorize(), updateQuestion)
router.delete('/:id', authorize(), deleteQuestion)

module.exports = router;

function addNewQuestion(req, res, next) {
    req.body.creator = req.user.id;
    req.body.createdAt = Date.now();
    req.body.accepted = false;
    questionService.addNewQuestion(req.body)
        .then(data => {res.status(200).json(data[0])})
        .catch(next);
}

function getAll(req, res, next) {
    questionService.getAll()
        .then(data => res.json(data))
        .catch(next);
}

function getMy(req, res, next) {
    questionService.getMy(req.user.id)
        .then(data => res.json(data))
        .catch(next);
}

function getById(req, res, next) {
    questionService.getById(req.params.id)
        .then(data => {
            if(!data){
                throw 'No question found.'
            }
            res.json(data[0])})
        .catch(next);
}

function updateQuestion(req, res, next) {
    if(!req.user.role.includes(Role.Admin))
    {
        // if normal user changes question,
        // it has to be checked again.
        req.body.accepted = false;
        // if not admin, dont allow changes of
        // questions from other creators
        // TODO this has to be made more secure
        if(req.user.id !== req.body.creator._id) {
            throw 'User not allowed to change others questions';
        }
    }
    questionService.updateQuestion(req.body)
        .then(data => res.json(data[0]))
        .catch(next);
}

function deleteQuestion(req, res, next) {
    questionService.getById(req.params.id)
        .then(data => {
            // unpack result
            data = data[0];
            if((!req.user.role.includes(Role.Admin)) &&
                !data.creator._id.equals(req.user.id)) {
                    throw 'User not allowed to delete question';
                }
            questionService.deleteQuestion(req.params.id)
            .then(data =>
                res.status(200).json({message: 'Question deleted'}))
        })
        .catch(next);
}
