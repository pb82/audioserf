"use strict";

var Sequelize = require('sequelize')
    , path = require('path')
    , logger = require('../logger')
    , config = require('../config').database
    , filename = config.filename;

var database = new Sequelize(filename, null, null, {
    storage: path.join(__dirname, '..', filename),
    dialect: 'sqlite',
    logging: config.logSql && logger
});

var Track = require('./track')(database, Sequelize);

exports.database = database;
exports.Track = Track;

/**
 * Initializes the database and orm. Schema generation is performed
 * in case the database has not already been created.
 * @param callback function to invoke after database persistence
 * has been set up
 */
exports.sync = function (callback) {
    database.sync({force: false}).then(callback, function (error) {
        logger.error('Error synchronizing database', error);
    });
};