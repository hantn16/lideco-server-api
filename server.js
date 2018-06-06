var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('./server/db/mongoose');
var cors = require('cors');
var multer = require('multer');
var fs = require('fs');
var Loki = require('lokijs');

var apiRoutes = require('./server/routes/api.routes');

var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'public/mean-stack-angularcli'));
// app.set('view engine', 'html');
// app.engine('html', require('hbs').__express);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
//app.use(express.static(path.join(__dirname, 'public/mean-stack-angularcli')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

// Set our api routes
app.use('/api', apiRoutes);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/mean-stack-angularcli/index.html'));
});

module.exports = app;