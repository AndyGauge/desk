import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

class Connection extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.handleEditChange = this.handleEditChange.bind(this);
    }
    handleEditChange = (e) => {
        this.props.connectionChange({[this.props.id]: {editmode: 'update'}})
    }
    handleViewNoteChange = (e) => {
        this.props.connectionChange({[this.props.id]: {visibleNotes: !this.props.visibleNotes}})
    }

    render() {
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
                    <Col sm>{this.props["device type"]}</Col>
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

