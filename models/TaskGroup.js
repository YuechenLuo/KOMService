/**
 * Task group  model class
 * by Peter
 */
'use strict';
    
const attrs = ['group_name', 'task_count', 'finished_count', 'color', 'order'];

class TaskGroup {

    constructor(req) {
        for (const key in req.body) {
            if ( attrs.includes(key) ) {
                this[key] = req.body[key];
            }
        }
    }

}

module.exports = TaskGroup;
