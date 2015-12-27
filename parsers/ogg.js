"use strict";

var parser = require('audio-metadata')
    , Tags = require('../tags')
    , fs = require('fs');

const HEADER_SIZE = 1024;

module.exports = class Parser {
    static get FOR() {
        return "audio/ogg";
    }

    parse(fd, filename, callback) {
        fs.read(fd, new Buffer(HEADER_SIZE), 0, HEADER_SIZE, 0, (err, bytes, buffer) => {
            if (!err) {
                var t = parser.ogg(buffer);
                callback(null, new Tags(t.artist, t.album, t.title, filename, Parser.FOR));
            } else {
                callback(null, new Tags(filename, filename, filename, filename, Parser.FOR));
            }
        });
    }
};