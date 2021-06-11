import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Col from 'react-bootstrap/Col'
import { faCheck, faWindowClose} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'



class Connection extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.handleEditChange = this.handleEditChange.bind(this);
        this.handleDeviceTypeChange = this.handleDeviceTypeChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleDescriptionChange=this.handleDescriptionChange.bind(this);
        this.handleNotesChange=this.handleNotesChange.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
    }
    handleEditChange = (e) => {
        this.props.connectionChange({[this.props.id]: {editmode: 'update'}})
    };
    handleDeviceTypeChange = (e) => {
        this.props.connectionChange({[this.props.id]: {'device type': e.target.value}})
    };
    handleAddressChange = (e) => {
        this.props.connectionChange({[this.props.id]: {address: e.target.value}})
    };
    handleUserChange = (e) => {
        this.props.connectionChange({[this.props.id]: {'user id': e.target.value}})
    }
    handlePasswordChange = (e) => {
        this.props.connectionChange({[this.props.id]: {password: e.target.value}})
    };
    handleDescriptionChange = (e) => {
        this.props.connectionChange({[this.props.id]: {description: e.target.value}})
    };
    handleNotesChange = (e) => {
        this.props.connectionChange({[this.props.id]: {notes: e.target.value}})
    };
    handleViewNoteChange = (e) => {
        this.props.connectionChange({[this.props.id]: {visibleNotes: !this.props.visibleNotes}})
    };
    handleCancelClick = (e) => {
        this.props.connectionChange({[this.props.id]: {editmode: ''}})
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const csrf_token = document.head.querySelector("[name~=csrf-token]").content
        let formData = new FormData();
        formData.append('authenticity_token', csrf_token);
        formData.append('_method', 'PUT');
        formData.append('connection[Device Type]', this.props['device type']);
        if (this.props.description) {
            formData.append('connection[description]', this.props.description);
        }
        if (this.props['user id']) {
            formData.append('connection[user id]', this.props['user id']);
        }
        if (this.props.password) {
            formData.append('connection[password]', this.props.password);

        }
        if (this.props.address) {
            formData.append('connection[address]', this.props.address);
        }
        if (this.props.notes) {
            formData.append('connection[notes]', this.props.notes);
        }
        fetch('/connections/'+this.props.id, {
            method: 'POST',
            body: formData
        }).then(response => {this.handleUpdate(response.status < 400)})
    }

    handleUpdate = (valid) => {
        if (valid) {
            this.props.connectionChange({[this.props.id]: {editmode: false}})
        }
    }

    render() {


        let type = this.props["device type"];
        if (['full', 'update'].includes(this.props.editmode)) {
            type = <Form.Control as={'select'} value={type ? type : ''} onChange={this.handleDeviceTypeChange}>
                {this.props.device_types.map((device_type) =>
                    <option value={device_type} key={'device' + device_type}>{device_type}</option>)}
            </Form.Control>
        }
        let address = this.props.address;
        if (['full', 'update'].includes(this.props.editmode)) {
            address = <Form.Control type={'text'} value={address ? address : ''} onChange={this.handleAddressChange}
                                    name={'connection[' + this.props.id + '][address]'}/>
        } else {
            address = <a href={address} target="_blank">{address}</a>
        }
        let user = this.props["user id"];
        if (['full', 'update'].includes(this.props.editmode)) {
            user = <Form.Control type={'text'} value={user ? user : ''} onChange={this.handleUserChange}
                                    name={'connection[' + this.props.id + '][user name]'}/>
        } else {
            user = <a href="#" onClick={this.props.copyText} className={'secret-link'}>{user}</a>
        };
        let password = this.props.password;
        if (['full', 'update'].includes(this.props.editmode)) {
            password = <Form.Control type={'text'} value={password ? password : ''} onChange={this.handlePasswordChange}
                                 name={'connection[' + this.props.id + '][password]'}/>            
        } else {
            password = <a href="#" onClick={this.props.copyText} className={'secret-link'}>{password}</a>
        }
        let description = this.props.description;
        if (['full', 'update'].includes(this.props.editmode)) {
            description = <Form.Control type={'text'} value={description ? description : ''} onChange={this.handleDescriptionChange}
                                     name={'connection[' + this.props.id + '][description]'}/>
        } else {
            description = <a href="#" onClick={this.props.copyText} className={'secret-link'}>{description}</a>
        }
        let edit;
        if (['full', 'update'].includes(this.props.editmode)) {
            edit = <ButtonGroup>
                    <Button variant='success' size='sm' onClick={this.handleSubmit}><FontAwesomeIcon icon={faCheck} /></Button>
                    <Button variant='danger' size='sm' type='reset' onClick={this.handleCancelClick}><FontAwesomeIcon icon={faWindowClose} /></Button>
                </ButtonGroup>
        } else {
            edit = <ButtonGroup>
                    <Button onClick={this.handleEditChange} variant={'link'} className={'secret-link'}>
                        ✏<span className={'d-float d-sm-none'}>Edit</span>
                    </Button>
                { (this.props.notes) ? (
                    <Button onClick={this.handleViewNoteChange} variant={'link'} className={'secret-link'}>
                        👀<span className={'d-float d-sm-none'}>Notes</span>
                    </Button>
                    ) : ''
                }
                </ButtonGroup>

        }
        let notes;
        if (this.props.visibleNotes) {
            notes =  <Row>
                <Col sm={{span: 10, offset: 1}}>
                    <pre>{this.props.notes}</pre>
                </Col>
            </Row>
        }
        if (['full', 'update'].includes(this.props.editmode)) {
            notes = this.props.notes;
            notes = <Row>
                <Col sm={{span: 10, offset: 0}}>
                <Form.Control as={'textarea'} value={notes ? notes : ''} onChange={this.handleNotesChange}
                              name={'connection[' + this.props.id + '][notes]'} rows={3}/>
                </Col>
            </Row>
        }
        return (
            <React.Fragment>
                <form>
                <Row className={'contact-record'} >
                    <Col sm>{type}</Col>
                    <Col sm>{address}</Col>
                    <Col sm>{user}</Col>
                    <Col sm>{password}</Col>
                    <Col sm>{description}</Col>
                    <Col sm>{edit}</Col>
                </Row>
                {notes}
                </form>
            </React.Fragment>
        )
    }
}
export default Connection;

