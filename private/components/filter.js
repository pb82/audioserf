"use strict";

export class Filter extends React.Component {
    render() {
        return <div className="filter">
            <input type="text" placeholder="Start typing..." onKeyUp={ this.props.handler } />
            <div className="filterOptions">
                <label>
                    <input name="filterBy"
                           checked={ this.props.selected == "title" }
                           onClick={ () => this.props.select("title") } type="radio" />
                    Title
                </label>
                <label>
                    <input name="filterBy"
                           checked={ this.props.selected == "album" }
                           onClick={ () => this.props.select("album") } type="radio" />
                    Album
                </label>
                <label>
                    <input name="filterBy"
                           checked={ this.props.selected == "artist" }
                           onClick={ () => this.props.select("artist") } type="radio" />
                    Artist
                </label>
            </div>
        </div>
    }
}