"use strict";

var Tags = require('../tags');

/**
 * Fallback parser for unsupported filed
 */
module.exports = class {
    static get FOR() {
        return "default";
    }

    get HEADER_SIZE() {
        return 0;
    }

    parse(_, filename, callback) {
        callback(null, new Tags(filename, filename, filename, filename, null));
    }
};