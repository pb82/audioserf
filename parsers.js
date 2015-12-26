"use strict";

var fs = require('fs')
    , path = require('path')
    , logger = require('./logger');

exports.PARSERS = new Map();
exports.SUPPORTED = [];

// Read an require all parsers in ./parsers
fs.readdirSync(path.join(__dirname, "parsers")).forEach((file) => {
    var Clazz = require("./parsers/" + file);

    exports.SUPPORTED.push(Clazz.FOR);
    exports.PARSERS.set(Clazz.FOR, new Clazz());

    logger("Registered parser for " + Clazz.FOR);
});