"use strict";

var config = require('./config')
    , path = require('path')
    , Pouch = require('pouchdb')
    , logger = require('./logger');

module.exports = function (app, scanner) {
    var port = config.server.port;
    var db = new Pouch('db', { db: require('memdown') });

    // The scanner found a new audio file. Add it to the index
    scanner.on("index", (tag) => {
        process.nextTick(() => {
            // db.put(tag);
            logger(`Added ${tag.file} to index`);
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
        db.info().then((info) => {
            res.json({ total: info.doc_count });
        });
    });

    /**
     * Search requests
     * term:    search term
     * by:      search category (title, album or artist)
     */
    app.get('/search', (req, res) => {
        var filterBy = req.query.by || "title";
        var term = new RegExp(req.query.term, "i");

        console.time("query");
        db.allDocs({
            include_docs: true
        }).then((result) => {
            let filtered = result.rows.map((row) => row.doc).filter((doc) => term.test(doc[filterBy]));
            console.timeEnd("query");

            res.json({
                result: filtered
            });

        }).catch((err) => {
            console.timeEnd("query");
            logger.error("query error", err);
        });
    });

    // Entry point
    app.listen(port, () => {
        logger(`Media server running on port ${port}`);
    });
};