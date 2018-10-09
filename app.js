'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const appConfig = require('./config');

const HTTPport = 8080;

const app = express();

// Config app
if ( process.argv.length < 5 ) {
    console.log('usage: app [db username] [db password] [secret key]');
    process.exit();
}
appConfig['dbUrl'] = `mongodb://${process.argv[2]}:${process.argv[3]}@${appConfig['dbUrl']}/${appConfig['dbName']}`;
appConfig['secretKey'] = process.argv[4];

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


app.listen(HTTPport, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log('Server listening HTTP on port '+HTTPport);
});


module.exports = {app};
