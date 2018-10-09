/**
 * User model class
 * by Peter
 */
'use strict';
class User {
    
    constructor(req) {
        for (const key in req.body) {
            this[key] = req.body[key];
        }
    }

}

module.exports = User;