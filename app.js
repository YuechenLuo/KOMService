'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const appConfig = require('./config');
const cors = require('cors');
var path = require("path");

const app = express();

// Config app
if ( process.argv.length < 6 ) {
    console.log('usage: app [PORT#] [db username] [db password] [secret key]');
    process.exit();
}

appConfig['httpPort'] = process.argv[2];
appConfig['dbUrl'] = `mongodb://${process.argv[3]}:${process.argv[4]}@${appConfig['dbUrl']}/${appConfig['dbName']}`;
appConfig['secretKey'] = process.argv[5];

// Enable CORS
app.use(cors());
// Enable public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Begin endpoints
 */
app.get('/', function(req, res) {
    res.send("API test!");
});


// test Eric app
app.get('/eric', function(req, res) {
    res.sendFile(path.join(__dirname+'/login.html'));
});
app.post('/login', function(req, res) {
    res.status(200).json({username:"Peter", cookie:"12345"});
})
app.get('/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname+'/dashboard.html'));
});
app.get('/email', function(req, res) {
    res.sendFile(path.join(__dirname+'/email.html'));
});
app.get('/getMails', function(req,res) {
    res.status(200).json({
        emails:[
            {
                Subject: 'Lorem ipsum dolor',
                From: 'Ted',
                To: 'Eric',
                Date: '4:30PM',
                Body: 'Lorem ipsum dolor sit amet, \nconsectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore \n\net dolore magna aliqua. \n\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            },
            {
                Subject: 'Felis bibendum ut tristique - fringilla',
                From: 'Jason',
                To: 'Eric',
                Date: 'yesterday',
                Body: `Quis ipsum suspendisse ultrices gravida dictum fusce. 
                        Felis bibendum ut tristique et egestas quis ipsum suspendisse. 
                        Diam volutpat commodo sed egestas egestas fringilla. Semper auctor neque vitae tempus quam pellentesque. Ut tristique et egestas quis ipsum suspendisse. Habitant morbi tristique senectus et netus et malesuada. Non consectetur a erat nam at. Felis eget nunc lobortis mattis aliquam faucibus purus in massa. Nibh tellus molestie nunc non blandit massa enim. Vitae congue mauris rhoncus aenean vel elit scelerisque. In egestas erat imperdiet sed euismod nisi porta lorem.`
            },
            {
                Subject: 'test1',
                From: 'Jane',
                To: 'Eric',
                Date: '11/15/18',
                Body: `Et sollicitudin ac orci phasellus egestas tellus.
                Amet justo donec enim diam. 
                Et egestas quis ipsum suspendisse ultrices gravida dictum fusce. Leo in vitae turpis massa sed elementum tempus egestas. 
                Facilisis leo vel fringilla est ullamcorper eget nulla facilisi etiam. At tempor commodo ullamcorper a lacus vestibulum sed arcu non. Mauris a diam maecenas sed. 

                A arcu cursus vitae congue mauris rhoncus aenean vel elit. Id diam maecenas ultricies mi eget mauris pharetra. At in tellus integer feugiat scelerisque varius morbi enim. Porta non pulvinar neque laoreet. Massa sapien faucibus et molestie ac feugiat sed lectus. Neque convallis a cras semper. Ultrices tincidunt arcu non sodales neque sodales ut. Imperdiet proin fermentum leo vel. Hendrerit gravida rutrum quisque non. Viverra suspendisse potenti nullam ac tortor. Lobortis elementum nibh tellus molestie nunc non blandit massa.Et pharetra pharetra massa massa. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt. Lacus luctus accumsan tortor posuere ac ut consequat. Amet consectetur adipiscing elit ut aliquam purus sit amet. At imperdiet dui accumsan sit. Cras tincidunt lobortis feugiat vivamus at augue eget arcu dictum. Maecenas pharetra convallis posuere morbi leo urna molestie. Nulla porttitor massa id neque. In tellus integer feugiat scelerisque varius. Sit amet mattis vulputate enim nulla aliquet. Turpis egestas pretium aenean pharetra magna ac. Metus dictum at tempor commodo ullamcorper a. Dolor sed viverra ipsum nunc.`
            }
        ]}
    );
})
app.post('/sendEmail', function(req, res) {
    console.log(req.body);
    res.status(200).send();
});
app.get('/drive', function(req, res) {
    res.sendFile(path.join(__dirname+'/drive.html'));
});
app.get('/getStorageContent', function(req, res) {
    console.log(req.query.path);
    if (req.query.path === '/') {
        res.json([{
            rid: '/myDocs/',
            name: 'myDocs',
            type: 'directory'
        }, {
            rid: '/myProjects/',
            name: 'myProjects',
            type: 'directory'
        }, {
            rid: '/readme.txt',
            name: 'readme.txt',
            type: 'file'
        }, {
            rid: '/HelloWorld.mp4',
            name: 'HelloWorld.mp4',
            type: 'file'
        }, {
            rid: '/myDocs/',
            name: 'myDocs',
            type: 'directory'
        }, {
            rid: '/myProjects/',
            name: 'myProjects',
            type: 'directory'
        }, {
            rid: '/readme.txt',
            name: 'readme.txt',
            type: 'file'
        }, {
            rid: '/HelloWorld.mp4',
            name: 'HelloWorld.mp4',
            type: 'file'
        }]);
    } else if (req.query.path === '/myDocs/') {
        res.json([{
                rid: '/myDocs/doc1.txt',
                name: 'doc1.txt',
                type: 'file'
        }, {
                rid: '/myDocs/doc2.txt',
                name: 'doc2.txt',
                type: 'file'
        }]);
    }
});

// End eric app test

app.post('/', function(req, res) {
    res.send({mes: "API post test!"});
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
