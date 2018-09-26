'use strict';
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const dao = require('./daoModule');

const USER_DB = 'users';


exports.signUp = (user) => {
    return new Promise((resolve, reject) => {
        // Find duplication
        console.log(dao.query(USER_DB, {email: user.email}));
        if ( dao.query(USER_DB, {email: user.email}) != 0 ) {
            reject('email used!');
        }
        if ( dao.query(USER_DB, {username: user.username}) != 0 ) {
            reject('username used!');
        }

        // sign up
        user.password = passwordHash.generate(user.password, {length:256});
        dao.insert(USER_DB, user)
        resolve();
    });
}

exports.authentication = (user, resolve, reject) => {
    const hashedPasswod = passwordHash.generate(user.password, {length:256});
}