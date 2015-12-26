"use strict";

var parser = require('audio-metadata')
    , Tags = require('../tags');

module.exports = class Parser {
    static get FOR() {
        return "audio/ogg";
    }

    get HEADER_SIZE() {
        return 1024;
    }

    parse(buffer, filename, callback) {
        var t = parser.ogg(buffer);
        callback(null, new Tags(t.artist, t.album, t.title, filename, Parser.FOR));
    }
};