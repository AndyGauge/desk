import React, { Component} from "react"
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import TimeInput from 'react-time-input';
import PropTypes from "prop-types";
class Hours extends Component {
    constructor(props) {
        super(props);

        this.state = {   };

        this.handleWorkOrderChange = this.handleWorkOrderChange.bind(this);
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
        this.handleActivityChange = this.handleActivityChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
    }
    handleWorkOrderChange = (e) => {
        this.props.hoursChange({[this.props.detailid]: {workorder: e.target.value} })
    }
    handleStartChange = (e) => {
        this.props.hoursChange({[this.props.detailid]: {start: e.target.value} })
    }
    handleEndChange = (e) => {
        this.props.hoursChange({[this.props.detailid]: {end: e.target.value} })
    }
    handleActivityChange = (e) => {
        this.props.hoursChange({[this.props.detailid]: {activity: e.target.value} })
    }
    handleStatusChange = (e) => {
        this.props.hoursChange({[this.props.detailid]: {status: e.target.value} })
    }
    render() {
        let workorder;
        if (this.props.editmode === 'full') {
            workorder = <input  type={'text'} value={this.props.workorder} onChange={this.handleWorkOrderChange} name={'hour[workorder]'}/>
        } else {
            workorder = this.props.workorder;
        }
        let start = this.props.start;
        if(this.props.editmode === 'full')  {
            start = <TimeInput initTime={this.props.start} onTimeChange={this.handleStartChange} name={'hour[start]'}/>
        }

        let end = this.props.end;
        if (this.props.editmode === 'full' || this.props.editmode === 'status') {
            end = <TimeInput initTime={this.props.end} onTimeChange={this.handleEndChange} name={this.props.editmode == 'status' ? 'hour[' + this.props.detailid + '][end]' : 'hour[end]'}/>
        }

        let activity;
        if (this.props.editmode === 'full') {
            activity = ( <select name={'hour[activity]'} value={this.props.activity ? this.props.activity : ''} onChange={this.handleActivityChange}>
                <option value={'Admin'}>Admin</option>
                <option value={'Depot'}>Depot</option>
                <option value={'On-site'}>On-site</option>
                <option value={'Remote'}>Remote</option>
                <option value={'Sick'}>Sick</option>
                <option value={'xTraining'}>xTraining</option>
                <option value={'Travel'}>Travel</option>
                <option value={'Vacation'}>Vacation</option>
                <option value={'OT On-Site'}>OT On-Site</option>
                <option value={'OT Travel'}>OT Travel</option>
                <option value={'OT Depot'}>OT Depot</option>
            </select> )
        } else {
            activity = this.props.activity;
        }

        let status;
        if (this.props.editmode === 'status' || this.props.editmode === 'full') {
            status = ( <select name={this.props.editmode == 'status' ? 'hour[' + this.props.detailid + '][status]' : 'hour[status]'} value={this.props.status ? this.props.status : ''} onChange={this.handleStatusChange}>
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

        let detailid;
        if (this.props.editmode === 'full' && this.props.detailid) {
            detailid = <input type={'hidden'} name={'hour[detailid]'} value={this.props.detailid} />
        }
        if (this.props.visible) {
            return(
                <Row className="hour-record">
                    <Col sm>{workorder}</Col>
                    <Col sm>{start}</Col>
                    <Col sm>{end}</Col>
                    <Col sm>{activity}</Col>
                    <Col sm>{status}{detailid}</Col>
                </Row>
            )
        } else {
            return null
        }

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