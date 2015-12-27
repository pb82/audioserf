"use strict";

module.exports = {
    server: {
        port: 3000
    },

    scanner: {
        entry: "/run/media/peter/Data/Music/" // Filesystem entry point
        // entry: __dirname
    },

    logger: {
        console: {
            enabled: true,
            colorize: true,
            level: 'debug'
        }
    }
};