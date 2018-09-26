'use strict';
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const dao = require('./daoModule');

const USER_DB = 'users';


exports.signUp = (user) => {
    return new Promise((resolve, reject) => {
        // Find duplication
        dao.query(USER_DB, {
            $or:[
            {'email': user.email},
            {'username': user.username}]
        })
        .then((res) => {
            console.log(res);
            if (res.length) return reject('User already exist!');  
            // sign up
            user.password = passwordHash.generate(user.password, {length:256});
            dao.insert(USER_DB, user)
            resolve();
        }, () => {
            reject('server error');
        });

    });
}

exports.authentication = (user, resolve, reject) => {
    return new Promise((resolve, reject) => {
        // Find user
        dao.query(USER_DB, {email: user.email})
        .then((rows) => {
            if (!rows.length) return reject('User not exist');

            // compare password hash
            if (passwordHash.verify(user.password, rows[0].password)) {
                resolve();
            } else {
                reject('Wrong password');
            }
        });
        
    });
}