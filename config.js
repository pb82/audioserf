"use strict";

module.exports = {
    server: {
        port: 3000
    },

    scanner: {
        entry: __dirname // Filesystem entry point
    },

    logger: {
        console: {
            enabled: true,
            colorize: true,
            level: 'debug'
        }
    }
};