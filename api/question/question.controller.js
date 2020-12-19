const express = require('express');
const router = express.Router();
const authorize = require('_middleware/authorize')
const questionService = require('./question.service');
const Role = require('_helpers/role');
const { func } = require('@hapi/joi');

router.post('/add', authorize(), addNewQuestion)
router.get('/', authorize(Role.Admin), getAll)

module.exports = router;

function addNewQuestion(req, res, next) {
    req.body.creator = req.user.id
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
