import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

class Connection extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.handleEditChange = this.handleEditChange.bind(this);
        this.handleDeviceTypeChange = this.handleDeviceTypeChange.bind(this);
    }
    handleEditChange = (e) => {
        this.props.connectionChange({[this.props.id]: {editmode: 'update'}})
    };
    handleDeviceTypeChange = (e) => {
        this.props.connectionChange({[this.props.id]: {'device type': e.target.value}})
    };
    handleViewNoteChange = (e) => {
        this.props.connectionChange({[this.props.id]: {visibleNotes: !this.props.visibleNotes}})
    }

    render() {
        let type = this.props["device type"];
        if (['full', 'update'].includes(this.props.editmode)) {
            type = <Form.Control as={'select'} value={type ? type : ''} onChange={this.handleDeviceTypeChange}>
                { this.props.device_types.map((device_type) => <option value={device_type} key={'device'+device_type}>{device_type}</option> )}
            </Form.Control>
        }
        let edit;
        if (['full', 'update'].includes(this.props.editmode)) {
            edit = (this.props.notes) ? (
                <Button onClick={this.handleViewNoteChange} variant={'link'} className={'secret-link'}>
                    👀<span className={'d-float d-sm-none'}>Notes</span>
                </Button>
            ) : '';
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
        return (
            <React.Fragment>
                <Row className={'contact-record'}>
                    <Col sm>{type}</Col>
                    <Col sm><a href={this.props.address} target="_blank">{this.props.address}</a></Col>
                    <Col sm><a href="#" onClick={this.props.copyText}
                               className={'secret-link'}>{this.props["user id"]}</a></Col>
                    <Col sm><a href="#" onClick={this.props.copyText}
                               className={'secret-link'}>{this.props.password}</a></Col>
                    <Col sm>{this.props.description}</Col>
                    <Col sm>{edit}</Col>
                </Row>
                {notes}
            </React.Fragment>
        )
    }
}
export default Connection;

