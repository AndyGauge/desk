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
            agent_guid: '',
            show_agent: false,
            agent_name: '',
            alarm_log: [],
            kaseya_alerts: [],
            alerts: [],
            machine_group: '',
        };
    }
    componentDidMount() {
        this.fetchController = new AbortController();
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
            })
            .catch(error => {
                if (error.name === 'AbortError') return;
                throw error;
            });
    }
    removeAgent = (machinegroup, agent) => {
        const kaseya_alerts = this.state.kaseya_alerts
        delete kaseya_alerts[machinegroup][agent]
        this.setState({kaseya_alerts})
        const formData = new FormData();
        formData.append('jwt', this.props.jwt)
        formData.append('machine_group', machinegroup)
        formData.append('agent', agent)
        fetch('/api/v1/kaseya/alerts/agent', {method: 'DELETE', body: formData, signal: this.fetchController.signal})
            .then(response => response.json())
            .catch(error => {
                if (error.name === 'AbortError') return;
                throw error;
            });
    }
    agentClick = (agent_guid, agent_name, machine_group) => {
        fetch('/api/v1/kaseya/alerts/' + agent_guid + '?jwt=' + this.props.jwt, {signal: this.fetchController.signal})
            .then(response => response.json())
            .then(alarm_log => this.setState(
                {
                    alarm_log:     alarm_log.results.sort((a,b) => new Date(b.Time) - new Date(a.Time)).slice(0,5),
                    alerts:        [...this.state.kaseya_alerts[machine_group][agent_name]],
                    machine_group: machine_group,
                    agent_name:    agent_name,
                }))
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
        formData.append('alerts', JSON.stringify(this.state.alerts))
        formData.append('machine_group', this.state.machine_group)
        fetch('/api/v1/kaseya/alerts', {method: 'POST', body: formData, signal: this.fetchController.signal})
            .then(response => response.json())
            .catch(error => {
                if (error.name === 'AbortError') return;
                throw error;
            });
    }

    render() {
        return (
            <ActionCableProvider url={API_WS_ROOT}>
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
                                            <ul onClick={() => this.agentClick(this.state.kaseya_alerts[machine_group][agent][0].agent, agent, machine_group)}>
                                                {this.state.kaseya_alerts[machine_group][agent].map((alert, key) =>
                                                    <li key={alert.alarm_id} style={key > 0 ? {display: "none"} : null}>
                                                        {alert.subject}
                                                    </li>
                                                )}
                                            </ul>
                                            {this.state.kaseya_alerts[machine_group][agent].length > 1 ? <p>{agent.length} more...</p> : null}
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
                        <Button
                            onClick={this.createTicket}
                        >
                            Create Ticket
                        </Button>
                        <Button href={'kaseyaliveconnect://'+ btoa(`{
                            "homePageUrl": "https://propak.ccmaint.com/liveconnect/",
                            "payload": {
                                "agentId": "${this.state.agent_guid}",
                                "navId": "dashboard"
                            }
                        }`)}>
                            LiveConnect
                        </Button>
                        <Button
                            onClick={() => this.removeAgent(this.state.machine_group, this.state.agent_name)}
                        >
                            Delete Alert
                        </Button>
                        <Button
                            onClick={this.closeModal}
                        >
                            Exit Dialog
                        </Button>
                    </Modal.Footer>
                </Modal>

            </ActionCableProvider>
        )
    }
}

export default AgentAlert;