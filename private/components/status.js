"use strict";

export class Status extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 0
        }
    }

    componentDidMount() {
        $.get('/status', (result) => {
            this.setState({
                total: result.total
            });
        });
    }

    render() {
        return (<div className="statusBar">
            {`You have ${this.state.total} files on disk`}
        </div>);
    }
}