import React, { Component} from "react"
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Col from 'react-bootstrap/Col'
import DatePicker from 'react-date-picker';

class TimetableCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workdate: new Date(),
            timetable: '/hours/timetable'
        }
    }
    changeDate = (workdate) => {
        window.open('/hours/timetable?cal=yes&date=' + this.getWorkdateISODate(workdate))
    }
    getWorkdateISODate = (workdate) => {
        let offsetTime = new Date(workdate.getTime())
        offsetTime.setMinutes(offsetTime.getMinutes() - workdate.getTimezoneOffset())
        return offsetTime.toISOString().substring(0,10)
    }
    render() {
        return (
            <React.Fragment>
                <div>
                    <DatePicker
                    onChange={this.changeDate}
                    value={this.state.workdate}
                    />
                </div>
            </React.Fragment>
            )

    }
}
export default TimetableCalendar;