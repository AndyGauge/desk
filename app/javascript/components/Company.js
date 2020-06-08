import React, { Component, useContext} from "react"
import Accordion from 'react-bootstrap/Accordion'
import AccordionContext from 'react-bootstrap/AccordionContext';
import {useAccordionToggle} from 'react-bootstrap/AccordionToggle';
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Connection from './Connection.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import PropTypes from "prop-types"

function ConnectionSearchForm(props) {
    const expandConnection = useContext(AccordionContext) || useAccordionToggle('ConnectionCollapse');
    return (
        <Form.Control {...props} onClick={expandConnection} type="text" id="connection_search" className={'searchinput'}/>
        )
}

class Company extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contacts: [],
            connections: [],
            incidents: [],
            calls: [],
            modalIncident: { open: false },
            modalConnection: { open: false },
            connection_search: '',
            filtered_connections: []
        };
        this.copyText = this.copyText.bind(this);
        this.connectionChange = this.connectionChange.bind(this);
        this.searchChonnection = this.searchConnection.bind(this);
        this.handleCreateConnection = this.handleCreateConnection.bind(this);
    }
    componentDidMount() {
        this.fetchController = new AbortController();
        const signal = this.fetchController.signal;
            fetch('/customers/' + this.props.id + '/contacts', {signal})
                .then(   response => response.json())
                .then(   contacts => this.setState({ contacts }))
                .catch(error => {
                    if (error.name === 'AbortError') return;
                    throw error;
                });
            this.fetchConnections();
            fetch('/customers/' + this.props.id + '/incidents', {signal})
                .then(   response => response.json())
                .then(  incidents => this.setState({ incidents }))
                .catch(error => {
                    if (error.name === 'AbortError') return;
                    throw error;
                });
    }
    fetchConnections = () => {
        const signal = this.fetchController.signal;
        fetch('/customers/' + this.props.id + '/connections', {signal})
            .then(   response => response.json())
            .then(connections => this.setConnectionState(connections))
            .catch(error => {
        if (error.name === 'AbortError') return;
        throw error;
        });
    }
    setConnectionState = (response) => {
        const connections = response.map(connection => {
            connection.visibleNotes = false;
            connection.editmode = '';
            return connection
        })
        const filtered_connections = connections;
        this.setState({connections, filtered_connections});
    }
    componentWillUnmount() {
        this.fetchController.abort();
    }
    copyText = (e) => {
        e.preventDefault()
        const tempStor = document.createElement('textarea');
        console.log(e.target)
        tempStor.value = e.target.text
        document.body.appendChild(tempStor);
        tempStor.select();
        document.execCommand('copy');
        document.body.removeChild(tempStor)
    }
    connectionChange = (connectionProperties) => {
        const connectionID = Object.keys(connectionProperties)[0]
        let connections = this.state.connections
        const idx = connections.findIndex(h => h.id == connectionID)
        connections[idx] = Object.assign(connections[idx], connectionProperties[connectionID])
        this.setState({connections})
    }
    searchConnection = (e) => {
        const connection_search = e.target.value;
        let terms = connection_search.toUpperCase().split(' ');
        const filtered_connections = this.state.connections.filter(conn => {
            return terms.every(term => {
                return Object.values(conn).join('').toUpperCase().indexOf(term) > -1;
            })
        })
        this.setState({connection_search, filtered_connections})

    }

    handleCreateConnection = (e) => {
        e.preventDefault();
        const csrf_token = document.head.querySelector("[name~=csrf-token]").content
        let formData = new FormData();
        formData.append('authenticity_token', csrf_token);
        formData.append('_method', 'POST');
        formData.append('connection[customerid]', this.props.id)
        formData.append('connection[Device Type]', this.state.modalConnection.deviceType);
        if (this.state.modalConnection.description) {
            formData.append('connection[description]', this.state.modalConnection.description);
        }
        if (this.state.modalConnection.userName) {
            formData.append('connection[user id]', this.state.modalConnection.userName);
        }
        if (this.state.modalConnection.password) {
            formData.append('connection[password]', this.state.modalConnection.password);

        }
        if (this.state.modalConnection.address) {
            formData.append('connection[address]', this.state.modalConnection.address);
        }
        if (this.state.modalConnection.notes) {
            formData.append('connection[notes]', this.state.modalConnection.notes);
        }
        fetch('/connections/', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(json_response => {
                this.setState({modalConnection: { open: false, description: '', userName: '', password: '', address: '', notes: ''}})
                this.fetchConnections()
            })
    }
    render () {
    return (
      <React.Fragment>
          <h1>{this.props.company}</h1>
          <Accordion>
              <Card className="card-collapse">
                  <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey="0">
                          Contacts
                      </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                      <Card.Body>

                          <div className="d-none d-md-flex contact-header row">
                                  <div className="col-sm">Name</div>
                                  <div className="col-sm">Office</div>
                                  <div className="col-sm">Extension</div>
                                  <div className="col-sm">Cell</div>
                                  <div className="col-sm">E-mail</div>
                          </div>
                          {this.state.contacts.map((contact,key) =>
                              <div key={"contact" + contact.Id} className="row contact-record">
                                  <div className="col-sm">{contact.ContactName}</div>
                                  <div className="col-sm">{contact.OfficePhone}</div>
                                  <div className="col-sm">{contact.OfficeExtension}</div>
                                  <div className="col-sm">{contact.CellPhone}</div>
                                  <div className="col-sm">{contact.Email}</div>
                              </div>
                          )}
                      </Card.Body>
                  </Accordion.Collapse>
              </Card>
              <Card>
                  <Card.Header className={"row"}>
                      <Col sm>
                          <Accordion.Toggle as={Button} variant="link" eventKey="ConnectionCollapse" >
                              Connections
                          </Accordion.Toggle>
                      </Col>
                      <Col sm>
                          <Button variant="primary" className="text-left" onClick={() => this.setState({modalConnection: { open: true, description: '', userName: '', password: '', address: '', notes: '' }})}>
                              <FontAwesomeIcon icon={faPlus} /> New
                          </Button>
                      </Col>
                      <Col sm>
                          <ConnectionSearchForm value={this.state.connection_search} onChange={this.searchConnection}/>
                      </Col>
                  </Card.Header>
                  <Accordion.Collapse eventKey="ConnectionCollapse">
                      <Card.Body>

                          <div className="d-none d-md-flex contact-header row">
                              <div className="col-sm">Type</div>
                              <div className="col-sm">Address</div>
                              <div className="col-sm">User</div>
                              <div className="col-sm">Password</div>
                              <div className="col-sm">Description</div>
                              <div className={"col-sm"} />
                          </div>
                          {this.state.filtered_connections.map((connection,key) =>
                                <Connection {...connection} copyText={this.copyText} key={"connection" + connection.id}
                                            connectionChange={this.connectionChange} device_types={this.props.device_types}/>
                             )}


                      </Card.Body>
                  </Accordion.Collapse>
              </Card>
              <Card>
                  <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey="2">
                          Incidents
                      </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="2">
                      <Card.Body>
                          <div className="d-none d-md-flex contact-header row">
                              <div className="col-sm">Date</div>
                              <div className="col-sm">Title</div>
                              <div className="col-sm">Tech</div>
                              <div className="col-sm">Status</div>
                          </div>
                          {this.state.incidents.map((incident,key) =>
                              <div key={"incident" + incident.Id} className="row contact-record">
                                  <div className="col-sm">{incident.OpenedDate}</div>
                                  <div className="col-sm">
                                      <Button variant="link" className="text-left" onClick={() => this.setState({ modalClass: 'Incident', modalContent: this.render_incident(incident), modalOpen: true, modalIncident: {...incident, open: true }})}>{incident.Title}</Button>
                                  </div>
                                  <div className="col-sm">{incident.Tech}</div>
                                  <div className="col-sm">{incident.Status}</div>
                              </div>
                          )}
                      </Card.Body>
                  </Accordion.Collapse>
              </Card>
          </Accordion>
          <Modal show = {this.state.modalConnection.open} size={"lg"} centered >
              <Form onSubmit={this.handleCreateConnection}>
              <Modal.Header>
                  <Modal.Title id ="customer-connection-modal-title">
                      {this.props.company} New Connection
                  </Modal.Title>
              </Modal.Header>
              <Modal.Body>

                      <Form.Group controlId={"connectionDeviceType"}>
                          <Form.Label>Device Type</Form.Label>
                          <Form.Control as={"select"}
                                        onChange={(e) => {const modalConnection = this.state.modalConnection; modalConnection.deviceType= e.target.value; this.setState({modalConnection})}}
                                        value={this.state.modalConnection.deviceType }>
                              {this.props.device_types.map((device_type) =>
                                  <option value={device_type} key={'device' + device_type}>{device_type}</option>)}
                          </Form.Control>
                      </Form.Group>
                      <Form.Group controlId={"connectionDescription"}>
                          <Form.Label>Description</Form.Label>
                          <Form.Control placeholder={"Describe New Secret"} onChange={(e) => {const modalConnection = this.state.modalConnection; modalConnection.description= e.target.value; this.setState({modalConnection})}}
                                        value={this.state.modalConnection.description } />
                      </Form.Group>
                      <Form.Group controlId={"connectionUserName"}>
                          <Form.Label>User Name</Form.Label>
                          <Form.Control placeholder={"admin@"+this.props.company.replace(/\s+/g, '').toLowerCase()+".com"} onChange={(e) => {const modalConnection = this.state.modalConnection; modalConnection.userName= e.target.value; this.setState({modalConnection})}}
                                        value={this.state.modalConnection.userName } />
                      </Form.Group>
                      <Form.Group controlId={"connectionPassword"}>
                          <Form.Label>Password</Form.Label>
                          <Form.Control placeholder={"******"} onChange={(e) => {const modalConnection = this.state.modalConnection; modalConnection.password= e.target.value; this.setState({modalConnection})}}
                                        value={this.state.modalConnection.password } />
                      </Form.Group>
                      <Form.Group controlId={"connectionAddress"}>
                          <Form.Label>Address</Form.Label>
                          <Form.Control placeholder={"https://"} onChange={(e) => {const modalConnection = this.state.modalConnection; modalConnection.address= e.target.value; this.setState({modalConnection})}}
                                        value={this.state.modalConnection.address } />
                      </Form.Group>
                      <Form.Group>
                          <Form.Label>Notes</Form.Label>
                          <Form.Control as={"textarea"} rows={"3"} onChange={(e) => {const modalConnection = this.state.modalConnection; modalConnection.notes= e.target.value; this.setState({modalConnection})}}
                                        value={this.state.modalConnection.notes } />
                      </Form.Group>

              </Modal.Body>
              <Modal.Footer>
                  <Button variant={"primary"} type="submit">Add</Button>
                  <Button onClick={() => {const modalConnection = this.state.modalConnection; modalConnection.open = false; this.setState({modalConnection})}}>Close</Button>
              </Modal.Footer>
              </Form>
          </Modal>

          <Modal
              show={this.state.modalIncident.open}
              size="lg"
              aria-labelledby="customer-modal-title"
              centered
          >
              <Modal.Header>
                  <Modal.Title id="customer-modal-title">
                      {this.props.company} Incident
                  </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Row>
                      <Col>{this.state.modalIncident.Title}</Col>
                      <Col><strong>Opened</strong></Col>
                      <Col><strong>Closed</strong></Col>
                  </Row>
                  <Row>
                      <Col>{this.state.modalIncident.Status}</Col>
                      <Col>{this.state.modalIncident.OpenedDate}</Col>
                      <Col>{this.state.modalIncident.ClosedDate}</Col>
                  </Row>
                  <Row>
                      <Col><strong>Contact</strong></Col>
                      <Col>{this.state.modalIncident.Contact}</Col>
                  </Row>
                  <Row>
                      <Col><strong>Problem</strong></Col>
                      <Col>{this.state.modalIncident.Problem}</Col>
                  </Row>
                  <Row>
                      <Col><strong>Solution</strong></Col>
                      <Col>{this.state.modalIncident.Solution}</Col>
                  </Row>
                  {this.state.calls.map((callEvent, key) =>
                      <Row key={"event" + callEvent.Id}>
                          <div className="col-md-10 offset-md-1 incident-grid">
                              <Row>
                                  <Col>{callEvent.cdTech}</Col>
                                  <Col>{callEvent.CallTime}</Col>
                                  <Col>{callEvent.Minutes}  Minutes</Col>
                                  <Col>{callEvent.Action}</Col>
                              </Row>
                              <Row>
                                  <Col>{callEvent.Notes}</Col>
                              </Row>
                          </div>
                      </Row>
                      )}
              </Modal.Body>
              <Modal.Footer>
                  <Button onClick={() => this.setState({modalIncident: {open: false}})}>Close</Button>
              </Modal.Footer>
          </Modal>
      </React.Fragment>
    );
  }
    render_incident = (incident) => {
        const signal = this.fetchController.signal;
        fetch('/incidents/' + incident.Id + '/events', {signal})
            .then(   response => response.json())
            .then(calls => this.setState({calls}))
            .catch(error => {
                if (error.name === 'AbortError') return;
                throw error;
            });
    }
}
Company.propTypes = {
  id: PropTypes.node,
  name: PropTypes.array
};
export default Company