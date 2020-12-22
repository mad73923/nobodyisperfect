const express = require('express');
const router = express.Router();
const authorize = require('_middleware/authorize')
const gameService = require('./game.service');
const Role = require('_helpers/role');
const State = require('_helpers/gameState');

router.post('/', authorize([Role.Admin, Role.GameMaster]), addNewGame)
router.get('/', authorize(), getAllOrPossibleToRegister)
router.get('/:id', authorize(), getById)
router.put('/', authorize([Role.Admin, Role.GameMaster]), updateGame)
router.put('/join/:id', authorize(), joinGame),
router.delete('/:id', authorize([Role.Admin, Role.GameMaster]), deleteGame)

module.exports = router;

function addNewGame(req, res, next) {
    req.body.gameMaster = req.user.id;
    req.body.createdAt = Date.now();
    gameService.addNewGame(req.body)
        .then(data => res.status(200).json(data))
        .catch(next);
}

function getAllOrPossibleToRegister(req, res, next) {
    if(req.user.role.includes(Role.Admin) || req.user.role.includes(Role.GameMaster)) {
        gameService.getAll()
            .then(data => {res.json(data)})
            .catch(next);
    }else{
        gameService.getAllCanRegister()
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
        .then(data => res.json(data))
        .catch(next);
}

function updateGame(req, res, next) {
    if(req.user.role.includes(Role.GameMaster))
    {
        // if not admin, dont allow changes of
        // game from other gamemasters
        // TODO this has to be made more secure
        if(req.user.id !== req.body.gameMaster) {
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
            if((!req.user.role.includes(Role.Admin)) &&
                !data.gameMaster.equals(req.user.id)) {
                    throw 'User not allowed to delete question';
                }
            gameService.deleteGame(req.params.id)
            .then(data =>
                res.status(200).json({message: 'Question deleted'}))
        })
        .catch(next);
}
