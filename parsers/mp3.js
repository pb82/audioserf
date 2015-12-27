"use strict";

var id3p = require("id3-parser")
    , fs = require("fs")
    , parser = require("audio-metadata")
    , logger = require("../logger")
    , Tags = require('../tags');

module.exports = class Parser {
    static get FOR() {
        return "audio/mpeg";
    }

    parse(fd, filename, callback) {
        fs.readFile(fd, (err, data) => {
            if (!err) {
                var t = parser.id3v2(data);
                if (t) {
                    callback(null, new Tags(t.title, t.album, t.artist, filename, Parser.FOR));
                } else {
                    id3p.parse(data).then((t) => {
                        if (t && t.artist) {
                            callback(null, new Tags(t.title, t.album, t.artist, filename, Parser.FOR));
                        } else {
                            logger.error("Error reading ID3 tag of " + filename);
                        }
                    });
                }
            } else {
                callback(null, new Tags(filename, filename, filename, filename, Parser.FOR));
            }
        });
    }
};