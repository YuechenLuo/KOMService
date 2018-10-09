'use strict';
const dao = require('./daoModule');
const uuid = require('node-uuid');

const USER_DB = 'users';


exports.reportExpense = (user_id, expense) => {
    return new Promise((resolve, reject) => {
        expense._id = uuid.v1();
        expense.status = 'SUBMITTED';
        expense.create_timestamp = Date.now();
        dao.update(USER_DB, {
            _id: user_id
        }, {
            $push: {
                "reimburseInfo.records": expense
            },
            $inc: {
                "reimburseInfo.credit": -expense.amount
            }
        }).then(() => {
            resolve(expense);
        }, (err) => {
            reject(err);
        });
    });
}

exports.update = (user_id, expense) => {
    return new Promise((resolve, reject) => {
        dao.update(USER_DB, {
            "reimburseInfo.records._id": expense._id
        }, {
            $set: {
                "reimburseInfo.records.$": expense
            }
        }).then((res) => {
            resolve(res);
        }, (err) => {
            reject(err);
        });
    });
}