"use strict";

export class Result extends React.Component {
    render() {
        return (<div className="results">
            {
                this.generateImage(this.props.result)
            }
            {
                this.generateResults(this.props.result)
            }
        </div>);
    }

    generateImage(results) {
        if (!results || results.length === 0) {
            return (<img src="images/no_result.png" alt="no result" />);
        }
    }

    generateResult(song) {
        return (<div className="player">
            <audio src={`songs/${song.file}`} preload="metadata" controls ref={ (tag) => {
                if (tag) {
                    tag.load();
                }
            }}>
                not supported
            </audio>
            <div>
                <b>{ song.title }</b><br />
                { song.album }<br />
                { song.artist }
            </div>
        </div>);
    }

    generateResults(songs) {
        var result = [];

        songs.forEach((song) => {
            result.push(this.generateResult(song));
        });

        return result;
    }
}