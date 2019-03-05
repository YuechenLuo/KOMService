'use strict';
const express = require('express');
const Expense = require('../models/Expense');
const reimburseMeModule = require('../modules/reimburseMeModule');
const userModule = require('../modules/userModule');
const appConfig = require('../config');

const router = express.Router();

// A middleware to verify access token
router.use((req, res, next) => {
    const token = req.headers.accesstoken;
    if (!token) respond(res, 403, 'Authentication failed.');

    userModule.verify_token(token)
    .then((id) => {
        req.userId = id;
        next();
    }, (err) => {
        respond(res, 403, `Authentication failed. (Error: ${err})`);
    });

});


// [PUT] Add a new expense report
router.put('/newExpense', (req, res) => {
    reimburseMeModule.reportExpense(req.userId, new Expense(req))
    .then((obj) => {
        respondObj(res, 200, obj)
    }, (err) => {
        respond(res, 500, `Unable to create expense report. (Error: ${err})`);
    });
});


// [PUT] update a reimbursement record
router.put('/update', (req, res) => {
    // TODO: update reimbursement
    reimburseMeModule.update(req.userId, new Expense(req))
    .then(() => {
        res.status(200).send();
    }, (err) => {
        respond(res, 500, `Unable to update. (Error ${err})`)
    });
});


function respond(res, code, mes) {
    res.status(code).json({'message':mes})
}

function respondObj(res, code, obj) {
    res.status(code).json(obj);
}

module.exports = router;