/**
 * user model class
 * by Peter
 */
'use strict';
class User {
    
    constructor(req) {
        this.email = req.body.email ? req.body.email : this.email;
        this.username = req.body.username ? req.body.username : this.username;
        this.password = req.body.password ? req.body.password : this.password;
        this.photoUrl = req.body.photoUrl ? req.body.photoUrl : this.photoUrl;
        this.accessToken = req.body.accessToken ? req.body.accessToken : this.accessToken;
    }
}

module.exports = User;