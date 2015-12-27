"use strict";

var config = require('./config')
    , path = require('path')
    , db = require('./model')
    , logger = require('./logger');

module.exports = function (app, scanner) {
    var port = config.server.port;

    // The scanner found a new audio file. Add it to the index
    scanner.on("index", (tag) => {
        db.Track.find({
            where: {
                file: tag.file
            }
        }).then((track) => {
            if (track) {
                logger(`${track.file} already in index`);
            } else {
                db.Track.create({
                    title: tag.title,
                    album: tag.album,
                    artist: tag.artist,
                    file: tag.file
                }).then((inserted) => {
                    logger(`Added ${inserted.file} to index`);
                });
            }
        });
    });

    // Start the scanner
    scanner.run();

    /**
     * Index route: contains the react app, just deliver
     * the file
     */
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    /**
     * Data for the status row
     */
    app.get('/status', (_, res) => {
        db.Track.count().then((result) => {
            res.json({
                total: result
            });
        });
    });

    /**
     * Search requests
     * term:    search term
     * by:      search category (title, album or artist)
     */
    app.get('/search', (req, res) => {
        var filterBy = req.query.by || "title";

        var search = {};
        search[filterBy] = {
            $like: ['%', req.query.term, '%'].join('')
        };

        console.time("query");

        db.Track.findAll({
            where: search
        }).then((result) => {
            console.timeEnd("query");
            res.json({
                result: result
            });
        });
    });

    // Entry point
    app.listen(port, () => {
        logger(`Media server running on port ${port}`);
    });
};