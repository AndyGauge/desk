import React, { Component} from "react"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import TimeInput from './timeInput.jsx';
import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPencilAlt } from '@fortawesome/free-solid-svg-icons'
class Hours extends Component {
    constructor(props) {
        super(props);

        this.state = {   };

        this.handleWorkOrderChange = this.handleWorkOrderChange.bind(this);
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
        this.handleActivityChange = this.handleActivityChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleEditChange = this.handleEditChange.bind(this);
    }
    handleWorkOrderChange = (e) => {
        this.props.hoursChange({[this.props.detailid]: {workorder: e.target.value} })
    }
    handleStartChange = (e) => {
        this.props.hoursChange({[this.props.detailid]: {start: e} })
    }
    handleEndChange = (e) => {
        this.props.hoursChange({[this.props.detailid]: {end: e} })
    }
    handleActivityChange = (e) => {
        this.props.hoursChange({[this.props.detailid]: {activity: e.target.value} })
    }
    handleStatusChange = (e) => {
        this.props.hoursChange({[this.props.detailid]: {status: e.target.value} })
    }
    handleEditChange = (e) => {
        this.props.hoursChange({[this.props.detailid]: {editmode: 'update'}})
    }
    handleNotesChange = (e) => {
        this.props.hoursChange({[this.props.detailid]: {notes: e.target.value} })
    }
    render() {
        let workorder;
        if (this.props.editmode === 'full') {
            workorder = <Form.Control type={'text'} value={this.props.workorder} onChange={this.handleWorkOrderChange}
                               name={'hour[workorder]'} className={'form-control hour-record'} placeholder={'workorder'}/>
        } else if (this.props.editmode === 'update') {
            workorder = <Form.Control type={'text'} value={this.props.workorder} onChange={this.handleWorkOrderChange}
                               name={'hour[' + this.props.detailid + '][workorder]'} className={'form-control hour-record'} placeholder={'workorder'}/>
        } else {
            workorder = this.props.workorder;
        }
        let start = this.props.start;
        if (this.props.editmode === 'full') {
            start = <TimeInput initTime={this.props.start} onTimeChange={this.handleStartChange} name={'hour[start]'}
                               className={'form-control hour-record'} placeholder={'start'}/>
        } else if (this.props.editmode === 'update') {
            start = <TimeInput initTime={this.props.start} onTimeChange={this.handleStartChange}
                               name={'hour['+this.props.detailid+'][start]'} className={'form-control hour-record'}
                               placeholder={'start'}/>
        }
        let end = this.props.end;
        if (['full', 'update', 'status'].includes(this.props.editmode)) {
            end = <TimeInput initTime={this.props.end} onTimeChange={this.handleEndChange}
                             name={['status', 'update'].includes(this.props.editmode) ? 'hour[' + this.props.detailid + '][end]' : 'hour[end]'}
                             className={'form-control hour-record'} placeholder={'end'}/>
        }

        let activity;
        if (['full', 'update'].includes(this.props.editmode)) {
            activity = (<Form.Control as={'select'} value={this.props.activity ? this.props.activity : ''}
                                onChange={this.handleActivityChange} className={'form-control hour-record'}
                                name={['status', 'update'].includes(this.props.editmode) ? 'hour[' + this.props.detailid + '][activity]' : 'hour[activity]'}>
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
            </Form.Control>)
        } else {
            activity = this.props.activity;
        }

        let status;
        if (['full', 'update', 'status'].includes(this.props.editmode)) {
            status = (<Form.Control as={'select'} className={'form-control hour-record'}
                name={['status', 'update'].includes(this.props.editmode) ? 'hour[' + this.props.detailid + '][status]' : 'hour[status]'}
                value={this.props.status ? this.props.status : ''} onChange={this.handleStatusChange} >
                <option value={''} />
                <option value={'Complete'}>Complete</option>
                <option value={'Loaner'}>Loaner</option>
                <option value={'On Way'}>On Way</option>
                <option value={'Parts'}>Parts</option>
                <option value={'Returning'}>Returning</option>
                <option value={'To Shop'}>To Shop</option>
            </Form.Control>)
        } else {
            status = this.props.status
        }

        let detailid;
        if (this.props.editmode === 'full' && this.props.detailid) {
            detailid = <Form.Control type={'hidden'} name={'hour[detailid]'} value={this.props.detailid} className={'form-control hour-record'}/>
        }
        let edit;
        if (['full', 'update'].includes(this.props.editmode)) {

        } else {
            edit = <Button onClick={this.handleEditChange} variant={'warning'} size={'sm'}>
                <FontAwesomeIcon icon={faPencilAlt} color={"white"}/><span className={'d-float'} style={{color:'white', paddingLeft:5}}>Edit</span>
            </Button>
        }

        let notes;
        if (['full', 'update'].includes(this.props.editmode)) {
            notes = <Row>
                <Col sm={10}>
                    <Form.Group controlId={"Notes" + this.props.detailid}>
                        <Form.Label>Notes</Form.Label>
                        <Form.Control as="textarea" rows="3" value={typeof this.props.notes === "string" ? this.props.notes : ""}
                                      name={['status', 'update'].includes(this.props.editmode) ? 'hour[' + this.props.detailid + '][notes]' : 'hour[notes]'}
                                      onChange={this.handleNotesChange} />
                    </Form.Group>
                </Col>
            </Row>
        }

        if (this.props.visible) {
            return(
                <React.Fragment>
                    <Row className="hour-record">
                        <Col sm xs={6}>{workorder}</Col>
                        <Col sm={{order: 2}} xs={{span: 6, order: 3}}>{start}</Col>
                        <Col sm={{order: 3}} xs={{span: 6, order: 4}}>{end}</Col>
                        <Col sm={{order: 4}} xs={{span: 6, order: 5}}>{activity}</Col>
                        <Col sm={{order: 5}} xs={{span: 6, order: 6}}>{status}{detailid}</Col>
                        <Col sm={{order: 6}} xs={{span: 6, order: 2}} >{edit}</Col>
                    </Row>
                    {notes}
                </React.Fragment>
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