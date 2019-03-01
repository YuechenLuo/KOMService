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
                group._id = uuid.v1();
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

exports.get_taskinfo = (user_id) => {
    return new Promise((resolve, reject) => {
        // Query for task groups
        dao.query(USER_DB, {
            _id: user_id,
        }, {
            "taskInfo": 1
        }).then((rows) => {
            resolve(rows[0].taskInfo);
        }, (err) => {
            reject(err);
        });

    });
}

exports.update_group = (user_id, group) => {
    const group_id = group._id;
    delete group["_id"]
    const set_argument = {}
    for (const key in group) {
        set_argument["taskInfo.taskGroups.$."+key] = group[key]
    }

    return new Promise((resolve, reject) => {
        dao.update(USER_DB, {
            _id: user_id,
            "taskInfo.taskGroups._id": group_id
        }, {
            "$set": set_argument
        }).then((rows) => {
            resolve();
        }, (err) => {
            reject(err);
        });
    });
}

exports.delete_group = (user_id, group_id) => {
    return new Promise((resolve, reject) => {
        dao.update(USER_DB, {
            _id: user_id,
        }, {
            $pull: {
                "taskInfo.tasks": {
                    "group": group_id
                },
                "taskInfo.taskGroups": {
                    _id: group_id
                }
            }
        }).then(() => {
            resolve();
        }, (err) => {
            reject(err);
        });
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

exports.update_task = (user_id, task) => {
    const task_id = task._id;
    delete task["_id"]
    const set_argument = {}
    for (const key in task) {
        set_argument["taskInfo.tasks.$."+key] = task[key]
    }

    return new Promise((resolve, reject) => {
        dao.update(USER_DB, {
            _id: user_id,
            "taskInfo.tasks._id": task_id
        }, {
            "$set": set_argument
        }).then((rows) => {
            resolve();
        }, (err) => {
            reject(err);
        });
    });
}

exports.delete_task = (user_id, task_id) => {
    return new Promise((resolve, reject) => {
        dao.update(USER_DB, {
            _id: user_id,
        }, {
            $pull: {
                "taskInfo.tasks": {
                    "_id": task_id
                }
            }
        }).then(() => {
            resolve();
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
