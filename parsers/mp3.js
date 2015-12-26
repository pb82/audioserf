"use strict";

var parser = require("id3-parser")
    , Tags = require('../tags');

module.exports = class Parser {
    static get FOR() {
        return "audio/mpeg";
    }

    get HEADER_SIZE() {
        return 1024;
    }

    parse(buffer, filename, callback) {
        parser.parse(buffer).then((t) => {
            callback(null, new Tags(t.artist, t.album, t.title, filename, Parser.FOR));
        });
    }
};