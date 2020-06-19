import React, { Component, useEffect} from "react"
import Alert from 'react-bootstrap/Alert'

class DeskAlert extends Component {
    constructor(props) {
        super(props);

        this.state = {
           show_alerts: true
        };
    }
    componentDidMount() {
        setTimeout(() => this.setState({show_alerts: false}), 3000)

    }

    render() {
        const notice = this.props.notice ? <Alert variant={"success"} dismissible show={this.state.show_alerts}>
            {this.props.notice}
        </Alert> : null

        const alert = this.props.alert ? <Alert variant={"danger"} dismissible show={this.state.show_alerts}>
            {this.props.alert}
        </Alert> : null
        return (
            <React.Fragment>
                     {notice}{alert}
            </React.Fragment>
        )
    }
}

export default DeskAlert;