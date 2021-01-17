const express = require('express');
const router = express.Router();
const authorize = require('_middleware/authorize')
const gameService = require('./game.service');
const Role = require('_helpers/role');
const State = require('_helpers/gameState');

const io = require('_helpers/socketio');
const { func } = require('@hapi/joi');
const gameState = require('../_helpers/gameState');

router.post('/', authorize([Role.Admin, Role.GameMaster]), addNewGame)
router.get('/', authorize(), getAllOrPossibleToRegister)
router.get('/:id', authorize(), getById)
router.put('/', authorize([Role.Admin, Role.GameMaster]), updateGame)
router.put('/join/:id', authorize(), joinGame)
router.put('/newRound/:id', authorize([Role.Admin, Role.GameMaster]), newRound)
router.delete('/:id', authorize([Role.Admin, Role.GameMaster]), deleteGame)
router.get('/result/:id', authorize(), getResult)

router.post('/answer', authorize(), addAnswer)
router.get('/answer/possible/:id', authorize(), answerPossible)

router.get('/answer/hasPicked/:id', authorize(), hasAlreadyPicked)
router.post('/answer/pick', authorize(), pickAnswer)


module.exports = router;

function addNewGame(req, res, next) {
    req.body.gameMaster = req.user.id;
    req.body.createdAt = Date.now();
    gameService.addNewGame(req.body)
        .then(data => res.status(200).json(data[0]))
        .catch(next);
}

function getAllOrPossibleToRegister(req, res, next) {
    if(req.user.role.includes(Role.Admin) || req.user.role.includes(Role.GameMaster)) {
        gameService.getAll()
            .then(data => {res.json(data)})
            .catch(next);
    }else{
        gameService.getAllCanRegisterOrIsPlayer(req.user.id)
            .then(data => res.json(data))
            .catch(next);
    }
}

function joinGame(req, res, next) {
    // TODO join only one game
    gameService.joinGame(req.user.id, req.params.id)
        .then(data => res.json(data))
        .catch(next);
}

function getById(req, res, next) {
    // TODO only if user is in players
    gameService.getById(req.params.id)
        .then(data => res.json(data[0]))
        .catch(next);
}

function newRound(req, res, next) {
    // TODO only let admin or gamemaster of game do this
    gameService.newRound(req.params.id)
        .then(data => res.json(data))
        .catch(next);
}

function updateGame(req, res, next) {
    if(req.user.role.includes(Role.GameMaster))
    {
        // if not admin, dont allow changes of
        // game from other gamemasters
        // TODO this has to be made more secure
        if(req.user.id !== req.body.gameMaster._id) {
            throw 'GameMaster not allowed to change others games';
        }
    }
    gameService.updateGame(req.body)
        .then(data => res.json(data))
        .catch(next);
}

function deleteGame(req, res, next) {
    gameService.getById(req.params.id)
        .then(data => {
            // unpack
            data = data[0]
            if((!req.user.role.includes(Role.Admin)) &&
                !data.gameMaster._id.equals(req.user.id)) {
                    throw 'User not allowed to delete question';
                }
            gameService.deleteGame(req.params.id)
            .then(data =>
                res.status(200).json({message: 'Question deleted'}))
        })
        .catch(next);
}


function addAnswer(req, res, next) {
    req.body.creator = req.body.creator._id;
    req.body.fromQuestion = req.body.fromQuestion._id;
    req.body.game = req.body.game._id;
    gameService.addAnswer(req.body, req.user)
        .then(data => {
            res.json(data);
        })
        .catch(next);
}

function answerPossible(req, res, next) {
    gameService.getPossibleAnswers(req.params.id, req.user.id)
    .then(data => {
        res.json(data);
    })
    .catch(next);
}

function hasAlreadyPicked(req, res, next) {
    gameService.hasAlreadyPicked(req.user.id, req.params.id)
    .then(data => {
        res.json(data);
    })
    .catch(next);
}

function pickAnswer(req, res, next) {
    gameService.pickAnswer(req.user.id, req.body.roundid, req.body.answerid)
    .then(data => {
        res.json(data);
    })
    .catch(next);
}

function getResult(req, res, next) {
    gameService.getResult(req.params.id)
    .then(data => {
        res.json(data);
    })
    .catch(next);
}
