import React, { Component} from "react"
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function ModalWorkorders(props) {
    return (
        <Modal show = {props.open} size={"lg"} centered >
            <Modal.Header>
                <Modal.Title id ="customer-details-modal-title">
                    Workorders
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.workorders.map( workorder => (
                            <React.Fragment key={'workorder'+workorder.id}>
                                <table onClick={() => props.selectWorkorder(workorder.workorder)} className={'table'} >
                                    <tbody>
                                    <tr><th style={{textAlign: 'center'}}>{workorder.workorder}</th></tr>
                                    <tr><th>{workorder.customer}</th></tr>
                                    <tr><th>{workorder.description}</th></tr>
                                    </tbody>
                                </table>

                            </React.Fragment>

                        )
                    )}

            </Modal.Body>

            <Modal.Footer>
                <Button onClick={props.close}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

class QuickButtons extends Component {
    constructor(props) {
        super(props)
        this.state = {
            workorder_show: false,
            workorders: [],
            workorder_modal: false,
        }
        this.sendAction=this.sendAction.bind(this)
        this.workorderPress=this.workorderPress.bind(this)
        this.workorderInput = React.createRef();
    }

    componentDidMount() {
        this.fetchController = new AbortController();
        this.fetchWorkorders();
    }

    workorderPress = (e) => {
        e.preventDefault()
        this.setState({workorder_show: true}, () =>  {
            if(this.workorderInput.current){this.workorderInput.current.focus();}

        })
    }

    setupFormData = (formData) => {
        const csrf_token = document.head.querySelector("[name~=csrf-token]").content
        formData.append('authenticity_token', csrf_token);
        formData.append('_method', 'POST');
        return formData
    }

    sendAction = (e) => {
        e.preventDefault();
        let formData = this.setupFormData(new FormData);
        formData.append('act', e.target.innerHTML);
        formData.append('workorder', this.props.workorder)

        fetch('/hours/action', {
            method: 'POST',
            body: formData
        })
            .then(this.props.update)
    }
    fetchWorkorders = () => {
        const signal = this.fetchController.signal;
        fetch('/workorders', {signal})
            .then(response => response.json())
            .then(workorders => this.setState({workorders}))
            .catch(error => {
                if (error.name === 'AbortError') return;
                throw error;
            });
    }

    render() {
        let workorder = false
        let travel
        let complete
        let depot
        let returning
        let lunch
        let lasthour = {}
        if (this.props.hours.length == 0) {
            workorder = true
            if(this.props.workorder && !this.state.workorder_show) {
                travel = <Col sm><Button size="lg" className='btnFullHeight' block onClick={this.sendAction}>Travel to site</Button></Col>
                depot =  <Col sm><Button size="lg" className='btnFullHeight' block onClick={this.sendAction}>Start Depot</Button></Col>
            }

        } else {
           lasthour = this.props.hours[this.props.hours.length -1]

            if (lasthour.activity == 'Travel' && lasthour.status == 'To Shop' && !lasthour.end ) {
                workorder = false
                travel = <Col sm><Button size="lg" className='btnFullHeight' block onClick={this.sendAction}>At Shop</Button></Col>
            } else if (lasthour.activity == 'Travel' && lasthour.status == 'On Way') {
                travel = <Col sm><Button size="lg" className='btnFullHeight' block onClick={this.sendAction}>On Site</Button></Col>
            } else if (lasthour.activity == 'On-site') {
                workorder = true
                if (!this.state.workorder_show) {
                    if (lasthour.status == 'Returning') {
                        complete = <Col sm><Button size="lg" className='btnFullHeight' block onClick={this.sendAction}>Back On Site</Button></Col>
                    } else if (lasthour.workorder !== this.props.workorder) {
                        travel = <Col sm><Button size="lg" className='btnFullHeight' block onClick={this.sendAction}>Travel to site</Button></Col>
                        complete = <Col sm><Button size="lg" className='btnFullHeight' block onClick={this.sendAction}>Remain On Site</Button></Col>
                    } else {
                        travel = <Col sm><Button size="lg" className='btnFullHeight' block onClick={this.sendAction}>Travel to Shop</Button></Col>
                        lunch = <Col sm><Button size="lg" className='btnFullHeight' block onClick={this.sendAction}>Lunch</Button></Col>
                        returning = <Col sm><Button size="lg" className='btnFullHeight' block onClick={this.sendAction}>Travel to Shop Returning</Button></Col>
                    }
                }
            } else if (lasthour.activity == 'Depot' && lasthour.status == '') {
                complete = <React.Fragment>
                        <Col sm><Button size="lg" className='btnFullHeight' block onClick={this.sendAction}>Complete</Button></Col>
                        <Col sm><Button size="lg" className='btnFullHeight' block onClick={this.sendAction}>Returning</Button></Col>
                </React.Fragment>
            } else if (lasthour.status =="Returning" || lasthour.status == "Complete" || lasthour.status == "To Shop") {
                workorder = true
                if (this.props.workorder && !this.state.workorder_show) {
                    travel = <Col sm>
                        <Button size="lg" className='btnFullHeight' block onClick={this.sendAction}>Travel to site</Button>
                    </Col>
                    depot = <Col sm>
                        <Button size="lg" className='btnFullHeight' block onClick={this.sendAction}>Start Depot</Button>
                    </Col>
                }
            }
        }
        let workorder_view
        if (this.state.workorder_show){
            workorder_view = <Col sm><div className="input-group">
                <Form.Control value={this.props.workorder} onChange={this.props.updateWorkorder} ref={this.workorderInput}></Form.Control>
                <Button onClick={(e) => {e.preventDefault(); this.setState({workorder_modal: true})}}><FontAwesomeIcon icon={faSearch} /></Button>
                <Button onClick={(e) => {e.preventDefault(); this.setState({workorder_show: false})}}>OK</Button>
            </div></Col>
        } else {
            workorder_view = <Col sm><Button size="lg" className='btnFullHeight' block onClick={this.workorderPress}>{this.props.workorder ? `Change Workorder (${this.props.workorder})` : 'Enter Workorder'}</Button></Col>
        }


        return(
            <React.Fragment>
                <ModalWorkorders open={this.state.workorder_modal} workorders={this.state.workorders} close={() => this.setState({workorder_modal: false})}
                selectWorkorder={(workorder) => {this.setState({workorder_modal: false});this.props.setWorkorder(workorder)}}/>
                <Row className='quickbuttons' >

                    {workorder && workorder_view}
                    {depot}
                    {travel}
                    {complete}
                    {returning}
                    {lunch}

                </Row>
            </React.Fragment>
        )
    }

}
export default QuickButtons;