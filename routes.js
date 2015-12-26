"use strict";

var config = require('./config')
    , path = require('path')
    , Pouch = require('pouchdb')
    , logger = require('./logger');

module.exports = function (app, scanner) {
    var port = config.server.port;

    Pouch.plugin(require('pouchdb-quick-search'));
    var db = new Pouch('db', { db: require('memdown') });

    // The scanner found a new audio file. Add it to the index
    scanner.on("index", (tag) => {
        db.put(tag);
        logger(`Added ${tag.file} to index`);
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
            // - 1 because of the _design doc (it also counts)
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

        db.search({
            query: req.query.term,
            fields: [filterBy],
            include_docs: true,
            limit: 10
        }).then((result) => {
            res.json({
                result: result.rows.map((row) => row.doc)
            });
        })
    });

    // Entry point
    app.listen(port, () => {
        logger(`Media server running on port ${port}`);
    });
};