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
        res.send("SignUp success!")
    }, (mes) => {
        res.send(`SignUp failed! (${mes})`)
    });
});

// [POST] user login
router.get('/login', (req, res) => {
    res.send(appConfig.dbUser);
});


module.exports = router;