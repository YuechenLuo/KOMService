'use strict';
const express = require('express');
const taskModule = require('../modules/taskModule');
const userModule = require('../modules/userModule');
const TaskGroup = require('../models/TaskGroup');
const Task = require('../models/Task');

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
        respond(res, 500, `Authentication failed. (Error: ${err})`);
    });
});

// [PUT] create_taskgroup
router.put('/createGroup', (req, res) => {
    taskModule.create_group(req.userId, new TaskGroup(req))
    .then((obj) => {
        respondObj(res, 200, obj)
    }, (err) => {
        respond(res, 500, `Unable to create task group. (Error: ${err})`);
    });
});


// [GET] get task groups
router.get('/getTasks', (req, res) => {
    taskModule.get_taskinfo(req.userId)
    .then((obj) => {
        respondObj(res, 200, obj)
    }, (err) => {
        respond(res, 500, `Unable to create task group. (Error: ${err})`);
    });
});

// [POST] update task group
router.post('/updateGroup', (req, res) => {
    taskModule.update_group(req.userId, new TaskGroup(req))
    .then((obj) => {
        respondObj(res, 200, obj)
    }, (err) => {
        respond(res, 500, `Unable to update task group. (Error: ${err})`);
    });
});

// [DELETE] delete task group
router.delete('/group/:id', (req, res) => {
    taskModule.delete_group(req.userId, req.params.id)
    .then((obj) => {
        respondObj(res, 200, obj)
    }, (err) => {
        respond(res, 500, `Unable to delete task group. (Error: ${err})`);
    });
});

// [PUT] create task
router.put('/createTask', (req, res) => {
    taskModule.create_task(req.userId, new Task(req))
    .then((obj) => {
        respondObj(res, 200, obj)
    }, (err) => {
        respond(res, 500, `Unable to create task. (Error: ${err})`);
    });
});

// [POST] update task group
router.post('/updateTask', (req, res) => {
    taskModule.update_task(req.userId, new Task(req))
    .then((obj) => {
        respondObj(res, 200, obj)
    }, (err) => {
        respond(res, 500, `Unable to update task. (Error: ${err})`);
    });
});

// [DELETE] delete task
router.delete('/:id', (req, res) => {
    taskModule.delete_task(req.userId, req.params.id)
    .then((obj) => {
        respondObj(res, 200, obj)
    }, (err) => {
        respond(res, 500, `Unable to delete task. (Error: ${err})`);
    });
});


function respond(res, code, mes) {
    res.status(code).json({'message':mes})
}

function respondObj(res, code, obj) {
    res.status(code).json(obj);
}

module.exports = router;
