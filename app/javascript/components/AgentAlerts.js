import React, { Component, useEffect} from "react"
import { ActionCableProvider, ActionCable } from 'react-actioncable-provider';
import Alert from 'react-bootstrap/Alert'
import { API_WS_ROOT, API_ROOT } from "../constants";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

class AgentAlert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            agent_alerts:[],
            alarms_by_agent: [],
            agent_guid: '',
            show_agent: false,
            agent_name: '',
            alarm_log: [],
            kaseya_alerts: [],
        };
    }
    componentDidMount() {
        this.fetchController = new AbortController();
        // this.interval = setInterval(() => this.processAlarms(), 10000);
        this.fetchAlerts();
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    fetchAlerts = () => {
        const signal = this.fetchController.signal;
        fetch('/api/v1/kaseya/alerts?jwt=' + this.props.jwt, {signal})
            .then(response => response.json())
            .then(kaseya_alerts => {
                this.setState({kaseya_alerts})
                // this.fetchAdditionalAlerts(agent_alerts.total)
            })
            .catch(error => {
                if (error.name === 'AbortError') return;
                throw error;
            });
    }
    // fetchAdditionalAlerts = (total) => {
    //     const signal = this.fetchController.signal;
    //     for (let skip=200;skip < total;skip+=100) {
    //         fetch('/api/v1/kaseya/alerts?jwt=' + this.props.jwt + '&skip=' + skip, {signal})
    //             .then(response => response.json())
    //             .then(agent_alerts_addon => {
    //                 this.setState({agent_alerts: [...this.state.agent_alerts, ...agent_alerts_addon.results]})
    //             })
    //             .catch(error => {
    //                 if (error.name === 'AbortError') return;
    //                 throw error;
    //             });
    //     }
    // }
    removeAlarm = (alarm_id) => {
        const agent_alerts = this.state.agent_alerts.filter((v,i,a) => {return v.AlarmId !=alarm_id})

        const formData = new FormData();
        formData.append('jwt', this.props.jwt)
        fetch('/api/v1/kaseya/alerts/' + alarm_id, {method: 'DELETE', body: formData, signal: this.fetchController.signal})
            .then(response => response.json())
            .then(doc => doc.Error == "None" ? this.setState({agent_alerts}) : null)
            .catch(error => {
                if (error.name === 'AbortError') return;
                throw error;
            });
    }
    removeAgent = (machinegroup, agent) => {
        const agent_alerts = this.state.agent_alerts.filter((v,i,a) => v.AgentId != agent_guid)
        this.state.agent_alerts.filter((v,i,a) => v.AgentId == agent_guid).map((alert)=> {
            this.removeAlarm(alert.AlarmId)
        })
        this.setState({agent_alerts}, this.processAlarms)
    }
    processAlarms = () => {
        // const signal = this.fetchController.signal;
        // fetch('/api/v1/kaseya/alerts/new?jwt=' + this.props.jwt, {signal})
        //     .then(response => response.json())
        //     .then(agent_alerts => {
        //         this.setState({agent_alerts: [...this.state.agent_alerts, ...agent_alerts.results]})
        //     })
        //     .catch(error => {
        //         if (error.name === 'AbortError') return;
        //         throw error;
        //     });

        // const alarms_by_agent = new Array()
        // const agent_ids = new Set()
        // for (const agent_alert of this.state.agent_alerts) { agent_ids.add(agent_alert.AgentId) }
        // for (const agent_id of agent_ids) {
        //     const agent_alarm = this.processAgent(this.state.agent_alerts.filter( (v,i,a) => v.AgentId === agent_id))
        //     if (agent_alarm.length > 0) {
        //         alarms_by_agent.push(agent_alarm)
        //     }
        // }
        // this.setState({alarms_by_agent})
        // Object.keys(this.state.kaseya_alerts).map((machine_group) => {
        //     Object.keys(this.state.kaseya_alerts[machine_group]).map((agent) => {
        //         this.processAgent(machine_group,agent)
        //     })
        // })

    }
    processAgent = (machinegroup, agent) => {
        // let alarms = this.state.kaseya_alerts[machinegroup][agent]
        // // If agent is online, remove all alerts related to offline/online
        // const offlineregex = /is (off|on)line/
        // let filtered_alarms = alarms.filter((v,i,a) => v.subject.match(offlineregex))
        // if (filtered_alarms.filter((v,i,a) => v.subject.match(offlineregex)[1] === "on").length > 0) {
        //     filtered_alarms.map((kill_alarm) => {
        //         this.removeAlarm(kill_alarm.alarm_id)
        //         alarms = alarms.filter((v,i,a) => v.alarm_id != kill_alarm.alarm_id)
        //     })
        // }
        // const duplicatecounterregex = /Monitoring generated (Counter|SNMP) ALARM/
        // filtered_alarms = alarms.filter((v,i,a) => v.subject.match(duplicatecounterregex))
        // if (filtered_alarms.length > 1) {
        //     filtered_alarms.pop()
        //     filtered_alarms.map((kill_alarm) => {
        //         this.removeAlarm(kill_alarm.AlarmId)
        //         alarms = alarms.filter((v,i,a) => v.alarm_id != kill_alarm.alarm_id)
        //     })
        // }
        // const kaseya_alerts = this.state.kaseya_alerts
        // kaseya_alerts[machinegroup][agent] = alarms
        // this.setState({kaseya_alerts})
    }
    agentClick = (agent_guid, agent_name) => {
        fetch('/api/v1/kaseya/alerts/' + agent_guid + '?jwt=' + this.props.jwt, {signal: this.fetchController.signal})
            .then(response => response.json())
            .then(alarm_log => this.setState({alarm_log: alarm_log.results.sort((a,b) => new Date(b.Time) - new Date(a.Time)).slice(0,5)}))
            .catch(error => {
                if (error.name === 'AbortError') return;
                throw error;
            });
        const show_agent = true
        this.setState({agent_guid, show_agent, agent_name})
    }
    closeModal = () => {
        this.setState({show_agent: false})
    }
    handleReceivedAlert = (response) => {
       this.setState({kaseya_alerts: response.message.kaseya_alerts})
    }

    createTicket = () => {
        const formData = new FormData();
        formData.append('jwt', this.props.jwt)
        formData.append('alarm', JSON.stringify(this.state.alarm_log[0]))
        formData.append('guid', this.state.agent_guid)
        formData.append('alerts', JSON.stringify(this.state.agent_alerts.filter((v,a,i) => v.AgentId == this.state.agent_guid)))
        fetch('/api/v1/kaseya/alerts', {method: 'POST', body: formData, signal: this.fetchController.signal})
            .then(response => response.json())
            .catch(error => {
                if (error.name === 'AbortError') return;
                throw error;
            });
    }

    render() {
        // const alerts = this.state.agent_alerts.map((alert,key) =>
        //         <Col key={alert.AlarmId} md={3}>
        //             <Alert dismissible
        //                    variant={alert.MonitorAlarmStateId == 1 ? "danger" : "success"}
        //                    onClose={() => this.removeAlarm(alert.AlarmId)}>
        //                 <Alert.Heading>{alert.agentName}</Alert.Heading>
        //                 <p>{alert.AlarmSubject}</p>
        //             </Alert>
        //         </Col>
        //     )
        // const alerts_by_agent = this.state.alarms_by_agent.map((agent,key) =>
        //     <Col key={agent[0].AlarmId} md={3}>
        //         <Alert
        //                variant={"danger"}
        //                dismissible
        //                onClose={() => this.removeAgent(agent[0].AgentId)}
        //                >
        //             <Alert.Heading>{agent[0].agentName}</Alert.Heading>
        //             <ul onClick = {() => this.agentClick(agent[0].AgentId, agent[0].AgentName) }>
        //             {agent.map((alert,key) =>
        //                 <li key = {alert.AlarmId} style={key > 0 ? {display:"none"} : null}>
        //                     {alert.AlarmSubject}
        //                 </li>
        //             )}
        //             </ul>
        //             {agent.length > 1 ? <p>{agent.length} more...</p> : null}
        //         </Alert>
        //     </Col>
        // )

        // const alerts =


        return (
            <ActionCableProvider url={API_WS_ROOT}>
                {/*<Row>*/}
                {/*    {alerts_by_agent.length > 0 ? alerts_by_agent : alerts}*/}
                {/*</Row>*/}
                <ActionCable
                    channel={{channel: 'AlertsChannel'}}
                    onReceived={this.handleReceivedAlert}
                >

                </ActionCable>

                <Row>
                    {Object.keys(this.state.kaseya_alerts).map((machine_group) =>
                        {return(
                            Object.keys(this.state.kaseya_alerts[machine_group]).map((agent) => {
                                return(<Col md={3} key={agent}>
                                        <Alert
                                            variant={"danger"}
                                            dismissible
                                            onClose={() => this.removeAgent(machine_group,agent)}
                                        >
                                            <Alert.Heading>{agent}</Alert.Heading>
                                            <ul onClick={() => this.agentClick(this.state.kaseya_alerts[machine_group][agent][0].agent_id, agent)}>
                                                {this.state.kaseya_alerts[machine_group][agent].map((alert, key) =>
                                                    <li key={alert.alarm_id} style={key > 0 ? {display: "none"} : null}>
                                                        {alert.subject}
                                                    </li>
                                                )}
                                            </ul>
                                            {agent.length > 1 ? <p>{agent.length} more...</p> : null}
                                        </Alert>
                                    </Col>)

                                    })

                        )}
                    )}
                </Row>

                <Modal
                    show={this.state.show_agent}
                    size={"lg"}
                    centered
                    onHide={this.closeModal}
                    >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {this.state.agent_name}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.alarm_log.map((log,key)=>
                            <Row key={'alarm_log'+key}>
                                <Col md={3}>{new Date(log.Time).toLocaleString('en-us')}</Col>
                                <Col>{log.Event}</Col>
                            </Row>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.createTicket}>Create Ticket</Button>
                        <Button onClick={this.closeModal}>Dismiss</Button>
                    </Modal.Footer>
                </Modal>

            </ActionCableProvider>
        )
    }
}

export default AgentAlert;