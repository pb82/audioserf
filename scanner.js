"use strict";

var fs = require('fs')
    , logger = require("./logger")
    , config = require("./config").scanner
    , mime = require('mime')
    , async = require('async')
    , parsers = require('./parsers')
    , EventEmitter = require('events').EventEmitter
    , path = require('path');

// Absolute Path -> Relative Path
function trunc(file) {
    return file.substring(config.entry.length, file.length);
}

/**
 * Reads the metadata of an audio file. This can be an
 * ID3 Tag or a Vorbis comment. Further formats could
 * be supported, but at the moments it's only this.
 *
 * @param file string, Absolute Path to the audio file
 * @param callback function, invoked with an instance of `Tags` class.
 */
function getMetadata(file, callback) {
    var mimetype = mime.lookup(file);

    if (parsers.SUPPORTED.indexOf(mimetype) >= 0) {
        async.waterfall([
            // Open the file
            (cb) => {
                fs.open(file, "r", cb);
            },

            // Read the header
            (fd, cb) => {
                let parser = parsers.PARSERS.get(mimetype);

                parser.parse(fd, trunc(file), (err, tag) => {
                    cb(err, fd, tag);
                });
            }
        ], function (err, fd, tag) {
            // Always close the file
            fs.close(fd, () => {
                callback(err, tag);
            });
        });
    } else {
        /**
         * Unsupported files will be indexed, but the filename is
         * used for all fields (title, album, artist).
         */
        logger.warn(`${file} is not a supported file`);
        parsers.PARSERS.get('default').parse(null, trunc(file), callback);
    }
}

/**
 * Recursive directory traversal. This class is implemented as an EventEmitter
 * that will emit `file` events for every (supported) file it encounters in a nested
 * folder structure.
 */
class Reader extends EventEmitter {
    constructor(entry) {
        super();
        this.entry = entry;
    }

    run() {
        fs.readdir(this.entry, (err, files) => {
            files.forEach((file) => {
                file = path.resolve(this.entry, file);

                let mimetype = mime.lookup(file);
                let stat = fs.statSync(file);

                if (stat && stat.isDirectory()) {
                    // Subdir
                    let subReader = new Reader(file);
                    subReader.on("file", (file) => this.emit("file", file));
                    subReader.run();
                } else if (stat && stat.isFile() && parsers.SUPPORTED.indexOf(mimetype) >= 0) {
                    // File
                    this.emit("file", file);
                }
            });
        });
    }
}

/**
 * Implements a directory scanner. Will traverse a nested fodler structure
 * and emit `index` events for all (supported) files it encounters. The `index`
 * event has the parsed Tag data attached.
 */
exports.Scanner = class extends EventEmitter {
    constructor(dir) {
        super();
        this.dir = dir;
    }

    run() {
        var reader = new Reader(this.dir);

        reader.on("file", (file) => {
            // Got a file from the reader
            getMetadata(file, (err, data) => {
                if (!err) {
                    this.emit("index", data);
                } else {
                    logger.error(`error parsing ${file}`);
                }
            });
        });

        // Run the directory reader
        reader.run();
    }
};