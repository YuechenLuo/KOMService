'use strict';
const express = require('express');
const User = require('../models/User');
const userModule = require('../modules/userModule');
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
    .then((userInfo) => {
        res.status(200).json(userInfo);
    }, (mes) => {
        respond(res, 401, mes);
    });
});

// A middleware to verify access token
router.use((req, res, next) => {
    const token = req.headers.accesstoken;
    if (!token) respond(res, 403, 'Authentication failed.');

    userModule.verify_token(token)
    .then((id) => {
        req.userId = id;
        next();
    }, (err) => {
        respond(res, 500, `Authentication failed. (Error: ${err})`);
    });

});

// [GET] get my profile
router.get('/info', (req, res) => {
    userModule.retrieveUserInfo(req.userId)
    .then((info) => {
        res.status(200).json(info);
    }, (err) => {
        respond(res, 500, `Authentication failed. (Error: ${err})`);
        // console.log(err);
    });
});

function respond(res, code, mes) {
    console.log({'message':mes});
    res.status(code).json({'message':mes});
}

module.exports = router;