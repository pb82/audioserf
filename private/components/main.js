"use strict";

import { _ } from "../..//bower_components/underscore/underscore";
import { Filter } from "./filter";
import { Status } from "./status";
import { Result } from "./result";

export class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            result: [],
            filterBy: "title"
        };

        [this.onFilter, this.onSelect, this.clearResult].forEach((fn) => {
            this[fn.name] = fn.bind(this);
        });
    }

    componentWillMount() {
        this.onFilter = _.debounce(this.onFilter, 500);
    }

    render() {
        return <div className="mainFrame">
            <Filter handler={ this.onFilter }
                    select={ this.onSelect }
                    selected={ this.state.filterBy }
            />
            <Result result={ this.state.result } />
            <Status />
        </div>
    }

    onSelect(filterBy) {
        this.setState({
            filterBy: filterBy
        });
    }

    clearResult() {
        this.setState({
            result: []
        });
    }

    onFilter(event) {
        var term = event.target.value;

        if (term) {
            $.get(`/search?term=${term}&by=${this.state.filterBy}`, (result) => {
                this.setState({
                    result: result.result,
                });
            }).fail(this.clearResult);
        } else {
            this.clearResult();
        }
    }
}