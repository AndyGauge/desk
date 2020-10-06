import React, { Component} from "react"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import TimeInput from './timeInput.jsx';
import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import Modal from "react-bootstrap/Modal";
class Hours extends Component {
    constructor(props) {
        super(props);

        this.state = { modalOpen: false };

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
        if(window.innerWidth > 575) {
            this.props.hoursChange({[this.props.detailid]: {editmode: 'update'}})
        } else {
            this.setState({modalOpen: true})
        }
    }
    handleNotesChange = (e) => {
        this.props.hoursChange({[this.props.detailid]: {notes: e.target.value} })
    }
    setupFormData = (formData) => {
        const csrf_token = document.head.querySelector("[name~=csrf-token]").content
        formData.append('authenticity_token', csrf_token);
        formData.append('_method', 'POST');
        return formData
    }
    handleUpdate = (e) => {
        e.preventDefault();
        let formData = this.setupFormData(new FormData);
        formData.append('workorder', this.props.workorder)
        if (this.props.start) {
            formData.append('start', this.props.start)
        }
        if (this.props.end && this.props.end != null){
            formData.append('end', this.props.end)
        }
        formData.append('activity', this.props.activity)
        if (this.props.status) {
            formData.append('status', this.props.status)
        }
        if (this.props.notes) {
            formData.append('notes', this.props.notes)
        }
        fetch('/hours/'+this.props.detailid, {
            method: 'PUT',
            body: formData
        }).then(() => {
            this.setState({modalOpen: false})
            this.props.fetchHours()
        })
    }
    zeroPad = (time) => {
        if(time === null || time === undefined){
            return ''
        }
        return ("0" + time).slice(-5)
    }
    render() {
        let name;
        switch(this.props.editmode) {
            case 'full':
                name = 'hour';
                break;
            case 'update':
            case 'status':
                name = 'hour['+this.props.detailid+']';
                break;
            case 'more':
                name = 'hour['+this.props.index+']';
                break;
        }

        let workorder;
         if (['full', 'update', 'more'].includes(this.props.editmode)) {
                workorder = <Form.Control type={'text'} value={this.props.workorder} onChange={this.handleWorkOrderChange}
                               name={name+'[workorder]'} className={'form-control hour-record'} placeholder={'workorder'}/>
        } else {
            workorder = this.props.workorder;
        }
        let start = this.props.start;
        if (['full', 'update', 'more'].includes(this.props.editmode)) {
            start = <TimeInput initTime={this.zeroPad(this.props.start)} onTimeChange={this.handleStartChange}
                               className={'form-control hour-record'} placeholder={'start'} name={name+'[start]'}/>
        }
        let end = this.props.end;
        if (['full', 'update', 'status', 'more'].includes(this.props.editmode)) {
            end = <TimeInput initTime={this.zeroPad(this.props.end)} onTimeChange={this.handleEndChange}
                             name={name+'[end]'} className={'form-control hour-record'} placeholder={'end'}/>
        }
        let activity;
        if (['full', 'update', 'more'].includes(this.props.editmode)) {
            activity = (<Form.Control as={'select'} value={this.props.activity ? this.props.activity : ''}
                                onChange={this.handleActivityChange} className={'form-control hour-record'}
                                name={name+'[activity]'}>
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
        if (['full', 'update', 'status', 'more'].includes(this.props.editmode)) {
            status = (<Form.Control as={'select'} className={'form-control hour-record'}
                name={name+'[status]'}
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
        if (['full', 'update', 'more'].includes(this.props.editmode)) {

        } else {
            let noted
            if (this.props.notes) {
                noted = <span>👀</span>
            }
            edit = <>
                {noted}
                <Button onClick={this.handleEditChange} variant={'warning'} size={'sm'}>
                    <FontAwesomeIcon icon={faPencilAlt} color={"white"}/><span className={'d-float'} style={{color:'white', paddingLeft:5}}>Edit</span>
                </Button>
            </>
        }

        let notes;
        if (['full', 'update', 'more'].includes(this.props.editmode)) {
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
                    <Modal show = {this.state.modalOpen} size={"lg"} centered >
                        <Form onSubmit={this.handleUpdate}>
                            <Modal.Header>
                                <Modal.Title id ="customer-connection-modal-title">
                                    Edit Capture Entry
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>

                                <Form.Group controlId={"editWorkOrder"}>
                                    <Form.Label>WorkOrder</Form.Label>
                                    <Form.Control type={'text'} value={this.props.workorder} onChange={this.handleWorkOrderChange}
                                                  name={'hour[workorder]'} className={'form-control hour-record'} placeholder={'workorder'}/>
                                </Form.Group>
                                <Form.Group controlId={"editStart"}>
                                    <Form.Label>Start</Form.Label>
                                    <TimeInput initTime={this.zeroPad(this.props.start)} onTimeChange={this.handleStartChange} name={'hour[start]'}
                                               className={'form-control hour-record'} placeholder={'start'}/>
                                </Form.Group>
                                <Form.Group controlId={"editEnd"}>
                                    <Form.Label>End</Form.Label>
                                    <TimeInput initTime={this.zeroPad(this.props.end)} onTimeChange={this.handleEndChange}
                                               name={['status', 'update'].includes(this.props.editmode) ? 'hour[' + this.props.detailid + '][end]' : 'hour[end]'}
                                               className={'form-control hour-record'} placeholder={'end'}/>
                                </Form.Group>
                                <Form.Group controlId={"editActivity"}>
                                    <Form.Label>Activity</Form.Label>
                                    <Form.Control as={'select'} value={this.props.activity ? this.props.activity : ''}
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
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId={"editStatus"}>
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control as={'select'} className={'form-control hour-record'}
                                                  name={['status', 'update'].includes(this.props.editmode) ? 'hour[' + this.props.detailid + '][status]' : 'hour[status]'}
                                                  value={this.props.status ? this.props.status : ''} onChange={this.handleStatusChange} >
                                        <option value={''} />
                                        <option value={'Complete'}>Complete</option>
                                        <option value={'Loaner'}>Loaner</option>
                                        <option value={'On Way'}>On Way</option>
                                        <option value={'Parts'}>Parts</option>
                                        <option value={'Returning'}>Returning</option>
                                        <option value={'To Shop'}>To Shop</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Notes</Form.Label>
                                    <Form.Control as="textarea" rows="3" value={typeof this.props.notes === "string" ? this.props.notes : ""}
                                                  name={['status', 'update'].includes(this.props.editmode) ? 'hour[' + this.props.detailid + '][notes]' : 'hour[notes]'}
                                                  onChange={this.handleNotesChange} />
                                </Form.Group>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant={"primary"} type="submit">Save</Button>
                                <Button variant="danger" onClick={() => {this.setState({modalOpen: false})}}>Cancel</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
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