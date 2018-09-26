'use strict';
const express = require('express');
const User = require('../models/User');
const userModule = require('../modules/userModules');
const appConfig = require('../config');

const router = express.Router();

// [GET] user router test
router.get('/test/:param', (req, res) => {
    res.send(`Hello ${req.params.param}!`);
});

// [POST] user signup
router.post('/signup', (req, res) => {
    userModule.signUp(new User(req))
    .then(() => {
        res.status(200).send();
    }, (mes) => {
        respond(res, 400, `SignUp failed! (${mes})`);
    });
});

// [POST] user login
router.post('/login', (req, res) => {
    userModule.authentication(new User(req))
    .then(() => {
        res.status(200).send();
    }, (mes) => {
        respond(res, 401, mes);
    });
});

function respond(res, code, mes) {
    console.log(code);
    res.status(code).json({'message':mes})
}

module.exports = router;