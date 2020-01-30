import React, { Component} from "react"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import DatePicker from 'react-date-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Row from 'react-bootstrap/Row'
import PropTypes from "prop-types";
import Hours from './Hours'
class Field extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hours: [],
            workdate: new Date(),
            workorder: '',
            techheader: null,
            newhourvisible: false,
        };
    }
    componentDidMount() {
        this.fetchHours()
    }
    componentWillUnmount() {
       this.fetchController.abort();
    }
    fetchHours = () => {
        this.fetchController = new AbortController();
        const signal = this.fetchController.signal;
        let workdate = this.state.workdate ? this.state.workdate : new Date();
        this.setState({workdate})
        fetch('http://localhost:3000/hours/' + this.props.tech + '/dated/' + workdate.toISOString().substring(0,10), {signal})
            .then(   response => response.json())
            .then(   hours => this.setState({ hours }))
            .catch(error => {
                if (error.name === 'AbortError') return;
                throw error;
            });
    }
    changeDate = (workdate) => this.setState({workdate}, this.fetchHours);
    newHour = () => {
        this.setstate({newhourvisible: true})
        let last_hour;
        if (this.state.hours.length > 0) {
            last_hour = this.state.hours[this.state.hours.length -1]
            this.setState({hours: this.state.hours.slice(0,-1)})
        }
        const [prev_status, activity, status] = this.popularStateTransitions(last_hour)
        if (prev_status) { last_hour.Status = prev_status; }
        this.setState({last_hour})
        let next_hour = { TechId: this.props.tech,
                    WorkDate: this.state.workdate,
                    WorkOrder: last_hour ? last_hour.WorkOrder : '',
                    StartTime: new Date().toLocaleTimeString('en-US', {hour12: false}),
                    EndTime:'',
                    Hours: '',
                    Activity: activity,
                    Status: status,
                    Notes: '',
                    Id: null}
        this.setState({next_hour})

    };
    popularStateTransitions = (hour) => {
        if (typeof(hour) == 'Undefined'){
           return [null, "Travel", "On Way"]
        }
        switch(hour.Activity) {
            case "Depot":
                return ["Complete", "Travel", "On Way"]
            case "Travel":
                if (hour.Status == 'On Way') {
                    return ["Complete", "On Site", ""]
                } else {
                    return [null, "Travel", "On Way"]
                }
            case "On Site":
                return ["Complete", "Travel", "To Shop"]
        }
    };
    render() {
        let hours = this.state.hours.map((hour,key) => {
               // this.setState({workorder: hour.workorder, techheader: hour.techheader})
                return (<Hours key={"hour"+hour.detailid} {...hour} editmode={'status'} />)
            })
        return(
            <React.Fragment>
                <DatePicker
                    onChange={this.changeDate}
                    value={this.state.workdate}
                />

                <Row className="d-none d-md-flex hours-header">
                    <Col sm>Work Order</Col>
                    <Col sm>Start</Col>
                    <Col sm>End</Col>
                    <Col sm></Col>
                    <Col sm></Col>
                </Row>
                {hours}
                <Row>
                    <Col>
                        <Hours key={"hournew"} workorder={this.state.workorder} techheader={this.state.techheader} visible={this.state.newhourvisible} editmode={'full'} />
                        <Button
                            variant="primary"
                            onClick={this.newHour}
                        >
                            <FontAwesomeIcon icon={faPlus} /> New
                        </Button>
                    </Col>
                </Row>

            </React.Fragment>
        )
    }
}
Field.propTypes = {
    tech: PropTypes.string,
};
export default Field;