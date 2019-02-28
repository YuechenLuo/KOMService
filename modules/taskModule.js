'use strict';
const dao = require('./daoModule');
const uuid = require('node-uuid');

const USER_DB = 'users';


exports.create_group = (user_id, group) => {
    return new Promise((resolve, reject) => {
        
        // Check for duplicate
        dao.query(USER_DB, {
            _id: user_id,
            "taskInfo.taskGroups.group_name": group.group_name
        }).then((rows) => {
            if (rows.length) {
                reject('group name exist!');
            } else {
                // Add group to db
                group.task_count = 0;
                group.finished_count = 0;
                if ( !group.color ) group.color = 0;
                
                dao.update(USER_DB, {
                    _id: user_id
                }, {
                    $push: {
                        "taskInfo.taskGroups": group
                    }
                }).then(() => {
                    resolve(group);
                }, (err) => {
                    reject(err);
                });
            }

            
        }, (err) => {
            reject(err);
        });



    });
}

exports.get_groups = (user_id) => {
    return new Promise((resolve, reject) => {
        // Query for task groups
        dao.query(USER_DB, {
            _id: user_id,
        }, {
            "taskInfo.taskGroups": 1
        }).then((rows) => {
            resolve(rows[0].taskInfo.taskGroups);
        }, (err) => {
            reject(err);
        });

    });
}

exports.update_group = (user_id, group) => {
    return new Promise((resolve, reject) => {
        
    });
}

exports.create_task = (user_id, task) => {
    return new Promise((resolve, reject) => {
        task._id = uuid.v1();
        if ( task.priority ) task.priority = 0;
        task.create_timestamp = Date.now();
        task.finished = false;

        dao.update(USER_DB, {
            _id: user_id,
        }, {
            $push: {
                "taskInfo.tasks": task
            }
        }).then(() => {
            resolve(task);
        }, (err) => {
            reject(err);
        });

    });
}


// exports.update = (user_id, expense) => {
//     return new Promise((resolve, reject) => {
//         dao.update(USER_DB, {
//             "reimburseInfo.records._id": expense._id
//         }, {
//             $set: {
//                 "reimburseInfo.records.$": expense
//             }
//         }).then((res) => {
//             resolve(res);
//         }, (err) => {
//             reject(err);
//         });
//     });
// }
