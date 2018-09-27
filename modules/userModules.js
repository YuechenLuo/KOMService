'use strict';
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const dao = require('./daoModule');
const appConfig = require('../config');
const ObjectId = require('mongodb').ObjectId;

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
            user.password = passwordHash.generate(user.password, {length:256});
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
                rows[0]['password'] = null;
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
            if (err) return reject(err);
            resolve(userInfo.userId);
        });
    });
}

exports.retrieveUserInfo = (user_id) => {
    return new Promise((resolve, reject) => {
        dao.query(USER_DB, {_id: ObjectId(user_id)})
        .then((res) => {
            // Delete cretical information
            // TODO: remove field
            res[0]['_id'] = null;
            res[0]['password'] = null;
            res[0]['accessToken'] = null;

            resolve(res[0]);
        }, (err) => {
            reject(err);
        });

    });
}