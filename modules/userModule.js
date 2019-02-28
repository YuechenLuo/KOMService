'use strict';
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const dao = require('./daoModule');
const appConfig = require('../config');
const uuid = require('node-uuid');

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
            if (res.length) return reject('User already exist!');  
            // sign up
            user._id = uuid.v1();
            user.password = passwordHash.generate(user.password, {length:256});
            // initialize db structure
            user.reimburseInfo = {
                credit: 1500,
                records: []
            }

            dao.insert(USER_DB, user)
            resolve();
        }, () => {
            reject('server error');
        });

    });
}

exports.authentication = (user) => {
    return new Promise((resolve, reject) => {
        // Find user
        dao.query(USER_DB, {email: user.email})
        .then((rows) => {
            if (!rows.length) return reject('User not exist');

            // compare password hash
            if (passwordHash.verify(user.password, rows[0].password)) {
                // TODO: Issue a token
                const user_id = rows[0]._id;
                delete rows[0]['password'];
                // TODO: delete password field completely

                const accessToken = jwt.sign({
                    userId: rows[0]._id
                }, appConfig.secretKey, {
                    expiresIn: '1d'
                });
                // console.log(user_id);        
                // save token info to user table
                dao.update(USER_DB, {
                    _id: user_id
                }, {
                    $set: {accessToken: accessToken}
                }).then(() => {
                    // return user information
                    rows[0]['accessToken'] = accessToken;
                    resolve(rows[0]);
                }, (err) => {
                    reject(err);
                });

            } else {
                reject('Wrong password');
            }
        });
        
    });
}

exports.verify_token = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, appConfig.secretKey, (err, userInfo) => {
            // verify if expire
            if (err) return reject(err);
            dao.query(USER_DB, {"_id": userInfo.userId})
            .then((res) => {
                if (res.length === 0) reject("User not exist.");
                else resolve(userInfo.userId);
            }, (err) => {
                reject(err);
            });
            
        });
    });
}

exports.retrieveUserInfo = (user_id) => {
    return new Promise((resolve, reject) => {
        dao.query(USER_DB, {_id: user_id})
        .then((res) => {
            if (res.length == 0) reject("user not found.");
            // Delete cretical information
            delete res[0]['password'];
            delete res[0]['accessToken'];

            resolve(res[0]);
        }, (err) => {
            reject(err);
        });

    });
}
