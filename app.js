'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const appConfig = require('./config');

const app = express();

// Config app
if ( process.argv.length < 6 ) {
    console.log('usage: app [PORT#] [db username] [db password] [secret key]');
    process.exit();
}

appConfig['httpPort'] = process.argv[2];
appConfig['dbUrl'] = `mongodb://${process.argv[3]}:${process.argv[4]}@${appConfig['dbUrl']}/${appConfig['dbName']}`;
appConfig['secretKey'] = process.argv[5];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/**
 * Begin endpoints
 */
app.get('/', function(req, res) {
    res.send("API test!");
});

// user apis
app.use('/user', require('./routers/userRouters'));
app.use('/reimburseMe', require('./routers/reimburseMeRouters'));
app.use('/frm', require('./routers/frmRouters'));


app.listen(appConfig.httpPort, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log(`Server listening HTTP on port ${appConfig.httpPort}`);
});


module.exports = {app};
