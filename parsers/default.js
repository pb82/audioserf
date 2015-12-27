"use strict";

var Tags = require('../tags');

/**
 * Fallback parser for unsupported filed
 */
module.exports = class {
    static get FOR() {
        return "default";
    }

    parse(fd, filename, callback) {
        callback(null, new Tags(filename, filename, filename, filename, null));
    }
};