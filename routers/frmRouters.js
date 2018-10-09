'use strict';
const express = require('express');
const frmModule = require('../modules/frmModule');

const router = express.Router();

// [GET] get topics
router.get('/topics', (req, res) => {
    frmModule.getFRMTopics()
    .then((topics) => {
        respondObj(res, 200, topics);
    }, (err) => {
        respond(res, 500, `Cannot get FRM topics. (err: ${err})`)
    });
});

function respond(res, code, mes) {
    res.status(code).json({'message':mes})
}

function respondObj(res, code, obj) {
    res.status(code).json(obj);
}

module.exports = router;