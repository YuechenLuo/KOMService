/**
 * User model class
 * by Peter
 */
'use strict';
class User {
    
    constructor(req) {
        console.log(req.body);
        for (const key in req.body) {
            console.log(key)
            this[key] = req.body[key];
        }
    }

}

module.exports = User;
