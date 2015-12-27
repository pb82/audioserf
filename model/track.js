"use strict";

module.exports = function (orm, types) {
    return orm.define('track', {
        title: types.STRING,
        album: types.STRING,
        artist: types.STRING,
        file: types.STRING
    });
};