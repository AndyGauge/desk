import React, { Component} from "react"
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Col from 'react-bootstrap/Col'
import DatePicker from 'react-date-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import Row from 'react-bootstrap/Row'
import PropTypes from "prop-types";
import Hours from './Hours'
import QuickButtons from './QuickButtons'

class Field extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hours: [],
            workdate: new Date(),
            workorder: '',
            techheader: null,
            newhourvisible: false,
            submitvisible: false,
            last_hour: null,
            new_hour: {},
            more_hours: [],
            notice_hours: false,
        };
        this.hoursChange = this.hoursChange.bind(this);
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
        fetch('/hours/' + this.props.tech + '/dated/' + this.getWorkdateISODate(workdate), {signal})
            .then(   response => response.json())
            .then(   hours => this.setHourState(hours))
            .catch(error => {
                if (error.name === 'AbortError') return;
                throw error;
            });
    }
    getWorkdateISODate = (workdate) => {
        let offsetTime = new Date(workdate.getTime())
        offsetTime.setMinutes(offsetTime.getMinutes() - workdate.getTimezoneOffset())
        return offsetTime.toISOString().substring(0,10)
    }
    setHourState = (response) => {
        let hours = response.hours.map(hour => {
            hour.start = this.convertDateTimeto24HourTime(hour.start)
            hour.end = this.convertDateTimeto24HourTime(hour.end)
            hour.editmode = '';
            return hour
        })
        let techheader = response.techheader
        let workorder=this.state.workorder
        if (!workorder && hours.length > 0) {
            workorder = hours[hours.length-1].workorder
        }
        this.setState({hours, techheader, workorder})
    }
    convertDateTimeto24HourTime = (datetime) => {
        if (datetime) {
            datetime = new Date(datetime)
            return datetime.getHours() + ':' + datetime.getMinutes().toString().padStart(2,'0')
        } else {
            return null
        }

    }
    changeDate = (workdate) => {
        let new_hour = {}, last_hour = null, newhourvisible = false, submitvisible = false;
        if (workdate === null) {
            workdate = new Date();
        }
        workdate.setHours(20);
        this.setState({workdate, new_hour, last_hour, newhourvisible, submitvisible}, this.fetchHours);
    }
    newHour = () => {
        if (this.state.newhourvisible) {
            this.setState({more_hours: [...this.state.more_hours, {editmode:'more'}]})
        } else {
            this.setState({newhourvisible: true, submitvisible: true})
            let last_hour;
            if (this.state.hours.length > 0) {
                last_hour = this.state.hours[this.state.hours.length -1]
                this.setState({hours: this.state.hours.slice(0,-1)})
            }
            const [prev_status, new_activity, new_status] = this.popularStateTransitions(last_hour)
            if(prev_status) {
                last_hour.status = prev_status
                last_hour.editmode = 'status'
                if(last_hour.end === null) {
                    last_hour.end = this.convertDateTimeto24HourTime(Date.now())
                }

            }
            let new_hour = this.state.new_hour
            new_hour.activity = new_activity
            new_hour.status = new_status
            if(last_hour.workorder) {
                new_hour.workorder = last_hour.workorder
            }
            new_hour.start= this.convertDateTimeto24HourTime(Date.now())

            this.setState({last_hour, new_hour})
        }
    };
    popularStateTransitions = (hour) => {
        if (typeof(hour) === 'undefined'){
           return [null, "Travel", "On Way"]
        }
        switch(hour.activity) {
            case "Depot":
                return ["Complete", "Travel", "On Way"]
            case "Travel":
                if (hour.status === 'On Way') {
                    return ["Complete", "On-site", ""]
                } else {
                    return [null, "Travel", "On Way"]
                }
            case "On-site":
                return ["Complete", "Travel", "To Shop"]
            default:
                return [null, "Travel", "On Way"];
        }
    };
    hoursChange = (hourProperties) => {
        if (typeof(hourProperties[1000]) == 'object') {
            const new_hour = Object.assign(this.state.new_hour, hourProperties[1000])
            this.setState({new_hour})
        } else if (this.state.last_hour && (typeof(hourProperties[this.state.last_hour.detailid])== 'object' )) {
            const last_hour = Object.assign(this.state.last_hour, hourProperties[this.state.last_hour.detailid])
            this.setState({last_hour})
        } else {
            const detailid = Object.keys(hourProperties)[0]
            if (detailid > 1000) {
                let hours = this.state.hours
                const idx = hours.findIndex(h => h.detailid == detailid)
                hours[idx] = Object.assign(hours[idx], hourProperties[detailid])
                const submitvisible = true
                this.setState({hours, submitvisible})
            } else {
                let more_hours = this.state.more_hours
                more_hours[detailid] = Object.assign(more_hours[detailid], hourProperties[detailid])
                this.setState({more_hours})
            }

        }
    }
    quickUpdate = (e) => {
        this.fetchHours()
        if (this.state.hours.length > 2) {
            this.setState({notice_hours:true})
        }
    }

    cancelForm = () => {

        this.setState({
            new_hour: {},
            last_hour: null,
            submitvisible: false,
            newhourvisible: false,
        })
        this.fetchHours()
    }
    render() {
        let hours = this.state.hours.map((hour,key) => {
                return (<Hours key={"hour"+hour.detailid}
                               hoursChange={this.hoursChange} {...hour}
                               visible={true}
                               fetchHours = {this.fetchHours}/>)
            })
        let partial_edit
        if (this.state.last_hour) {
            partial_edit = <Hours
                key={'hourslast'}
                visible={this.state.newhourvisible}
                editmode={'status'}
                hoursChange={this.hoursChange}
                {...this.state.last_hour}
            />
        }
        let notice
        if (this.state.notice_hours) {

            notice = <ul> {this.state.hours.slice(-2).reverse().map((hour) => {
                return <li>{hour.workorder} {hour.activity} {hour.start} - {hour.end} </li>
            })} </ul>
        }
        const csrf_token = document.head.querySelector("[name~=csrf-token]").content
        if (this.state.techheader) {
            return(
                <React.Fragment>
                    <DatePicker
                        onChange={this.changeDate}
                        value={this.state.workdate}
                    />
                    <form action={'/hours'} method={'post'}>
                        <input type="hidden" name="authenticity_token" value={csrf_token} readOnly={true} />
                        <input type="hidden" name="hour[techheader]" value={this.state.techheader} readOnly={true} />
                        <QuickButtons hours={this.state.hours} show={!this.state.submitVisible} workorder={this.state.workorder}
                            updateWorkorder={(e) => this.setState({workorder: e.target.value})} tech={this.props.tech}
                            update={this.quickUpdate} setWorkorder={(workorder) => this.setState({workorder})}
                        />
                        {notice}
                    <Row className="d-none d-md-flex hours-header">
                        <Col sm>Work Order</Col>
                        <Col sm>Start</Col>
                        <Col sm>End</Col>
                        <Col sm >Activity</Col>
                        <Col sm >Status</Col>
                        <Col sm />
                    </Row>
                    {hours}
                    <Row>
                        <Col>

                                {partial_edit}
                                <Hours
                                    key={"hournew"}
                                    visible={this.state.newhourvisible}
                                    hoursChange={this.hoursChange}
                                    editmode={'full'}
                                    detailid={1000}
                                    workorder={''}
                                    {...this.state.new_hour}

                                />
                            {this.state.more_hours.map((hour,key) => {
                                return (<Hours key={"morehour"+key}
                                               hoursChange={this.hoursChange} {...hour}
                                               visible={true}
                                               fetchHours = {this.fetchHours}
                                               index = {key}
                                               detailid={key}
                                        />)
                            })}
                                <ButtonToolbar className={'field-buttons'}>
                                    <Button
                                        variant="primary"
                                        onClick={this.newHour}
                                    >
                                        <FontAwesomeIcon icon={faPlus} /> New
                                    </Button>
                                    <Button
                                        className={this.state.submitvisible ? 'visible':'invisible'}
                                        variant={"success"}
                                        type={"submit"}
                                    ><FontAwesomeIcon icon={faCheck} /> Save</Button>
                                    <Button
                                        className={this.state.submitvisible ? 'visible':'invisible'}
                                        variant={"danger"}
                                        onClick={this.cancelForm}
                                    >Cancel</Button>
                                </ButtonToolbar>
                        </Col>
                    </Row>
                    </form>

                </React.Fragment>
            )
        } else {
            return (
                <div>loading...</div>
            )
        }

    }
}
Field.propTypes = {
    tech: PropTypes.string,
};
export default Field;