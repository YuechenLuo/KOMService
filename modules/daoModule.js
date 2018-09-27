'use strict';
const MongoClient = require('mongodb').MongoClient;
const url = require('../config').dbUrl;
const dbName = require('../config').dbName;

const dbConfig = { useNewUrlParser: true };

exports.insert = (collName, obj) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, dbConfig, (err, db) => {
            if (err) return reject(err);
            const dbo = db.db(dbName);

            dbo.collection(collName).insertOne(obj, (err, res) => {
                if (err) return reject(err);
                db.close();
                resolve();
            });
        });
    });
}

exports.query = (collName, query) => {
    return new Promise((resolve, reject) => {

        MongoClient.connect(url, dbConfig, (err, db) => {
            if (err) return reject(err);
            const dbo = db.db(dbName);
            dbo.collection(collName).find(query).toArray((err, res) => {
                if (err) return reject(err);
                db.close();
                // console.log(res);
                resolve(res);
            });

        });
        
    });
}

exports.update = (collName, query, new_value) => {
    return new Promise((resolve, reject) => {

        MongoClient.connect(url, dbConfig, (err, db) => {
            if (err) return reject(err);
            const dbo = db.db(dbName);

            dbo.collection(collName).updateOne(query, new_value, (err) => {
                if (err) return reject(err);
                db.close();
                resolve();
            })
        });
    });
}