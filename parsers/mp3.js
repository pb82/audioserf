"use strict";

var id3p = require("id3-parser")
    , fs = require("fs")
    , parser = require("audio-metadata")
    , logger = require("../logger")
    , Tags = require('../tags');


/**
 * No usable ID3 parsers found and i don't want to write my own at the moment.
 * So i just try to use information about path and filenames.
 *
 * Tested different ID3 parsers for node... all of them had their problems. On
 * top of it most seem to require reading the whole file which is unpleasant when
 * the amount of files is in the thousands.
 *
 */
module.exports = class Parser {
    static get FOR() {
        return "audio/mpeg";
    }

    parse(fd, filename, callback) {

        var f = filename.split("/");
        if (f && f.length === 3) {
            callback(null, new Tags(f[2], f[1], f[0], filename, Parser.FOR));
        } else {
            callback(null, new Tags(filename, filename, filename, filename, Parser.FOR));
        }
    }
};