"use strict";

/**
 * Storage class for an audio track
 */
module.exports = class {
    constructor(artist, album, title, file, type) {
        this.artist = artist;
        this.album = album;
        this.title = title;
        this.file = file; // path relative to base dir
        this.type = type; // mime type of the file
    }
}