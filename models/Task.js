/**
 * Task model class
 * by Peter
 */
'use strict';
const attrs = ['_id', 'group', 'body', 'priority', 'deadline',
                'create_timestamp', 'finished', 'finish_timestamp'];

class Task {

    constructor(req) {
        for (const key in req.body) {
            if ( attrs.includes(key) ) {
                this[key] = req.body[key];
            }
        }
    }

}

module.exports = Task;
