'use strict';
const express = require('express');
// const frmModule = require('../modules/frmModule');

const router = express.Router();

function respond(res, code, mes) {
    res.status(code).json({'message':mes})
}

function respondObj(res, code, obj) {
    res.status(code).json(obj);
}

module.exports = router;
