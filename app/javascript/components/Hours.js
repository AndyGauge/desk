import React, { Component} from "react"
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import PropTypes from "prop-types";
class Hours extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }
    render() {
        let start
            if (this.props.start) {
                const start_date = new Date(this.props.start)
                start = start_date.getHours() + ':' + start_date.getMinutes().toString().padStart(2,'0')
                if (this.props.editmode == 'full') {
                    start = <input name={'start'}>start</input>
                }
            } else {
                start = <input name={'start'} />
            }
        let end
            if (this.props.end){
                const end_date = new Date(this.props.end);
                end = end_date.getHours() + ':' + end_date.getMinutes().toString().padStart(2,'0')
                if (this.props.editmode == 'full') {
                    end = <input name={'end'}>end</input>
                }
                } else {
                end = <input name={'end'} />
            }

        let status
        if (this.props.editmode == 'status' || this.props.editmode == 'full') {
            status = ( <select name={'status'} value={this.props.status}>
                <option value={'Complete'}>Complete</option>
                <option value={'Loaner'}>Loaner</option>
                <option value={'On Way'}>On Way</option>
                <option value={'Parts'}>Parts</option>
                <option value={'Returning'}>Returning</option>
                <option value={'To Shop'}>To Shop</option>
            </select> )
        } else {
            status = this.props.status
        }
        return(
                <Row className="hour-record">
                    <Col sm>{this.props.workorder}</Col>
                    <Col sm>{start}</Col>
                    <Col sm>{end}</Col>
                    <Col sm>{this.props.activity}</Col>
                    <Col sm>{status}</Col>
                </Row>
        )
    }
}
Hours.propTypes = {
    activity: PropTypes.string,
    detailid: PropTypes.number,
    end: PropTypes.string,
    hours: PropTypes.number,
    noreport: PropTypes.bool,
    notes: PropTypes.string,
    start: PropTypes.string,
    status: PropTypes.string,
    techheader: PropTypes.number,
    timestamp: PropTypes.string,
    upsize_ts: PropTypes.number,
    workorder: PropTypes.string,
};
export default Hours;