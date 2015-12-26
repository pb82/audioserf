"use strict";

var express = require('express')
    , logger = require('./logger')
    , Scanner = require('./scanner').Scanner
    , config = require('./config');

var App = express();

// Static assets
App.use(express.static(__dirname + '/bower_components'));
App.use(express.static(__dirname + '/public'));
App.use('/songs', express.static(config.scanner.entry));

// Express config
App.use(require('body-parser').urlencoded({
    extended: true
}));

App.use(require('body-parser').json());

// Start
require('./routes')(App, new Scanner(config.scanner.entry));