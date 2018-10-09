'use strict';
const dao = require('./daoModule');

const USER_DB = 'users';
const FRM_TOPICS_DB = 'frmTopics';

exports.getFRMTopics = () => {
	return new Promise((resolve, reject) => {
		dao.query(FRM_TOPICS_DB, {})
		.then((res) => {
			resolve(res);
		}, (err) => {
			reject(err);
		});
	});
}