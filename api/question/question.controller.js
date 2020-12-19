const express = require('express');
const router = express.Router();
const authorize = require('_middleware/authorize')
const questionService = require('./question.service');
const Role = require('_helpers/role');
const { func } = require('@hapi/joi');

router.post('/add', authorize(), addNewQuestion)
router.get('/', authorize(Role.Admin), getAll)
router.put('/', authorize(), updateQuestion)

module.exports = router;

function addNewQuestion(req, res, next) {
    req.body.creator = req.user.id;
    req.body.createdAt = Date.now();
    req.body.accepted = false;
    questionService.addNewQuestion(req.body)
        .then(data => res.status(200).json(data))
        .catch(next);
}

function getAll(req, res, next) {
    questionService.getAll()
        .then(data => res.json(data))
        .catch(next);
}

function updateQuestion(req, res, next) {
    if(req.user.role !== Role.Admin)
    {
        req.body.accepted = false;
        // if not admin, dont allow changes of
        // questions from other creators
        if(req.user.id !== req.body.creator) {
            throw 'User not allowed to change others questions';
        }
    }
    questionService.updateQuestion(req.body)
        .then(data => res.json(data))
        .catch(next);
}
