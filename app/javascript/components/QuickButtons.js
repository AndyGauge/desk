import React, { Component} from "react"
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'


class QuickButtons extends Component {
    constructor(props) {
        super(props)
        this.state = {
            workorder_show: false
        }
        this.sendAction=this.sendAction.bind(this)
        this.workorderPress=this.workorderPress.bind(this)
        this.workorderInput = React.createRef();
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

    render() {
        let workorder = false
        let travel
        let complete
        let depot
        let lasthour = {}
        if (this.props.hours.length == 0) {
            workorder = true
            if(this.props.workorder && !this.state.workorder_show) {
                travel = <Col sm><Button size="lg" block onClick={this.sendAction}>Travel to site</Button></Col>
                depot =  <Col sm><Button size="lg" block onClick={this.sendAction}>Start Depot</Button></Col>
            }

        } else {
           lasthour = this.props.hours[this.props.hours.length -1]

            if (lasthour.activity == 'Travel' && lasthour.status == 'To Shop' && !lasthour.end ) {
                workorder = false
                travel = <Col sm><Button size="lg" block onClick={this.sendAction}>At Shop</Button></Col>
            } else if (lasthour.activity == 'Travel' && lasthour.status == 'On Way') {
                travel = <Col sm><Button size="lg" block onClick={this.sendAction}>On Site</Button></Col>
            } else if (lasthour.activity == 'On-site') {
                workorder = true
                if (lasthour.status == 'Returning') {
                    travel = <Col sm><Button size="lg" block onClick={this.sendAction}>Travel to Shop</Button></Col>
                    complete = <Col sm><Button size="lg" block onClick={this.sendAction}>Back On Site</Button></Col>
                } else if (lasthour.workorder !== this.props.workorder) {
                    travel = <Col sm><Button size="lg" block onClick={this.sendAction}>Travel to site</Button></Col>
                    complete = <Col sm><Button size="lg" block onClick={this.sendAction}>Returning</Button></Col>
                } else {
                    travel = <Col sm><Button size="lg" block onClick={this.sendAction}>Travel to Shop</Button></Col>
                    complete = <Col sm><Button size="lg" block onClick={this.sendAction}>Returning</Button></Col>
                }

            } else if (lasthour.activity == 'Depot' && lasthour.status == '') {
                complete = <React.Fragment>
                        <Col sm><Button size="lg" block onClick={this.sendAction}>Complete</Button></Col>
                        <Col sm><Button size="lg" block onClick={this.sendAction}>Returning</Button></Col>
                </React.Fragment>
            } else if (lasthour.status =="Returning" || lasthour.status == "Complete" || lasthour.status == "To Shop") {
                workorder = true
                if (this.props.workorder && !this.state.workorder_show) {
                    travel = <Col sm>
                        <Button size="lg" block onClick={this.sendAction}>Travel to site</Button>
                    </Col>
                    depot = <Col sm>
                        <Button size="lg" block onClick={this.sendAction}>Start Depot</Button>
                    </Col>
                }
            }
        }
        let workorder_view
        if (this.state.workorder_show){
            workorder_view = <Col sm><div class="input-group">
                <Form.Control value={this.props.workorder} onChange={this.props.updateWorkorder} ref={this.workorderInput}></Form.Control>
                <Button onClick={(e) => {e.preventDefault(); this.setState({workorder_show: false})}}>OK</Button>
            </div></Col>
        } else {
            workorder_view = <Col sm><Button size="lg" block onClick={this.workorderPress}>{this.props.workorder ? `Change Workorder (${this.props.workorder})` : 'Enter Workorder'}</Button></Col>
        }


        return(
            <Row className='quickbuttons' >

                {workorder && workorder_view}
                {depot}
                {travel}
                {complete}

            </Row>
        )
    }

}
export default QuickButtons;