"use strict";

module.exports = {
    server: {
        port: 3000
    },

    scanner: {
        entry: __dirname
    },

    database: {
        logSql: false,
        filename: 'audio.db'
    },

    logger: {
        console: {
            enabled: true,
            colorize: true,
            level: 'debug'
        }
    }
};