import React, { Component, useContext, useRef, useState} from "react";
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import {useAccordionToggle} from 'react-bootstrap/AccordionToggle';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse'
import Connection from './Connection.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPlusCircle, faInfoCircle, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import Form from 'react-bootstrap/Form';
import IdleTimer from 'react-idle-timer';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import PropTypes from "prop-types";

function ConnectionSearchForm(props) {
    const searchRef = useRef(null)
    const scrollAndExpandConnection = () => {
        expandConnection()
        setTimeout(() => {
            window.scrollBy({left: 0, top: searchRef.current.getBoundingClientRect().top - 5, behavior: 'smooth'})
        }, 500)

    }
    const expandConnection = useContext(AccordionContext) ? () => void 0 : useAccordionToggle('ConnectionCollapse');
    return (
        <Form.Control {...props} onClick={scrollAndExpandConnection} type="text" id="connection_search" className={'searchinput'} ref={searchRef} />
        )
}

function MachineSearchForm(props) {
    const searchRef = useRef(null)
    const scrollAndExpandConnection = () => {
        expandMachine()

    }
    const expandMachine = useContext(AccordionContext) ? () => void 0 : useAccordionToggle('MachineCollapse');
    return (
        <Form.Control {...props} onClick={scrollAndExpandConnection} type="text" id="machine_search" className={'searchinput'} ref={searchRef} />
    )
}

function ModalIncident(props) {
    return (
        <Modal
            show={props.open}
            size="lg"
            aria-labelledby="customer-modal-title"
            centered
        >
            <Modal.Header>
                <Modal.Title id="customer-modal-title">
                    {props.Title}
                </Modal.Title>
                <span>{props.Total} minutes</span>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col><strong>Opened</strong></Col>
                    <Col>{props.OpenedDate}</Col>
                    <Col><strong>Closed</strong></Col>
                    <Col>{props.ClosedDate}</Col>
                </Row>
                <Row>
                    <Col><strong>Status</strong></Col>
                    <Col>{props.Status}</Col>
                    <Col><strong>Contact</strong></Col>
                    <Col>{props.Contact}</Col>
                </Row>
                <Row>
                    <Col><strong>Problem</strong></Col>
                    <Col>{props.pcode}</Col>
                    <Col><strong>Solution</strong></Col>
                    <Col>{props.scode}</Col>
                </Row>
                <Row>
                    <Col>{props.Problem}</Col>
                    <Col>{props.Solution}</Col>
                </Row>
                <Row style={{paddingTop:20}}>
                    <Col><strong>Tech</strong></Col>
                    <Col><strong>Date</strong></Col>
                    <Col><strong>Minutes</strong></Col>
                    <Col><strong>Action</strong></Col>
                </Row>
                {props.calls.map((callEvent, key) =>

                    <div className="incident-grid" key={"event" + callEvent.id}>
                        <Row>
                            <Col>{callEvent.cdtech}</Col>
                            <Col>{new Date(callEvent["call time"]).toLocaleDateString('en-us')}</Col>
                            <Col>{callEvent.minutes}</Col>
                            <Col>{callEvent.action}</Col>
                        </Row>
                        <Row>
                            <Col><p style={{paddingLeft:5}}>{callEvent.notes}</p></Col>
                        </Row>
                    </div>

                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.closeHandler}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

function ModalFormField(props) {
    return (
        <Form.Group controlId={props.attribute}>
            <Form.Label>{props.label}</Form.Label>
            <Form.Control {...props.controlAttributes} placeholder={props.placeholder} onChange={(e) => {props.changeHandler({[props.attribute]: e.target.value})}} value={props.value } />
        </Form.Group>
    )
}

function ModalCreateConnection(props) {
    const company = props.company || ''
    return (
        <Modal show = {props.open} size={"lg"} centered >
            <Form onSubmit={props.handleCreateConnection}>
                <Modal.Header>
                    <Modal.Title id ="customer-connection-modal-title">
                        {props.company} New Connection
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form.Group controlId={"connectionDeviceType"}>
                        <Form.Label>Device Type</Form.Label>
                        <Form.Control as={"select"}
                                      onChange={(e) => {props.setConnection({deviceType: e.target.value})}}
                                      value={props.deviceType }>
                            {props.device_types.map((device_type) =>
                                <option value={device_type} key={'device' + device_type}>{device_type}</option>)}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId={"connectionDescription"}>
                        <Form.Label>Description</Form.Label>
                        <Form.Control placeholder={"Describe New Secret"} onChange={(e) => {props.setConnection({description: e.target.value})}}
                                      value={props.description } />
                    </Form.Group>
                    <Form.Group controlId={"connectionUserName"}>
                        <Form.Label>User Name</Form.Label>
                        <Form.Control placeholder={"admin@"+company.replace(/\s+/g, '').toLowerCase()+".com"} onChange={(e) => {props.setConnection({userName: e.target.value})}}
                                      value={props.userName } />
                    </Form.Group>
                    <Form.Group controlId={"connectionPassword"}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control placeholder={"******"} onChange={(e) => {props.setConnection({password: e.target.value})}}
                                      value={props.password } />
                    </Form.Group>
                    <Form.Group controlId={"connectionAddress"}>
                        <Form.Label>Address</Form.Label>
                        <Form.Control placeholder={"https://"} onChange={(e) => {props.setConnection({address: e.target.value})}}
                                      value={props.address } />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Notes</Form.Label>
                        <Form.Control as={"textarea"} rows={"3"} onChange={(e) => {props.setConnection({notes:e.target.value})}}
                                      value={props.notes } />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant={"primary"} type="submit">Add</Button>
                    <Button onClick={() => {props.setConnection({open: false})}}>Close</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

function ModalCreateContact(props) {
    return (
        <Modal show = {props.open} size={"lg"} centered >
            <Form onSubmit={props.handleCreateContact}>
                <Modal.Header>
                    <Modal.Title id ="customer-contact-modal-title">
                        New {props.company} Contact
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <ModalFormField label='Name' attribute={'ContactName'} placeholder={"First Last"} value={props.ContactName} changeHandler={props.setContact}/>
                <ModalFormField label='Office Phone' attribute={'OfficePhone'} placeholder={'(XXX) XXX-XXXX'} value={props.OfficePhone} changeHandler={props.setContact} />
                <ModalFormField label='Office Extension' attribute={'OfficeExtension'} placeholder={'XXXX'} value={props.OfficeExtension} changeHandler={props.setContact} />
                <ModalFormField label='Cell Phone' attribute={'CellPhone'} placeholder={'(XXX) XXX-XXXX'} value={props.CellPhone} changeHandler={props.setContact} />
                <ModalFormField label='E Mail' attribute={'email'} placeholder={'whomever@company.com'} value={props.email} changeHandler={props.setContact} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={"primary"} type="submit">Add</Button>
                    <Button onClick={() => {props.setContact({open: false})}}>Close</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

function ModalCreateIncident(props) {
    const [showmore, setShowmore] = useState(false);
    return (
        <Modal show = {props.open} size={"lg"} centered >
            <Form onSubmit={props.handleCreateIncident}>
                <Modal.Header>
                    <Modal.Title id ="customer-incident-modal-title">
                        New Incident: {props.ContactName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModalFormField label='Title' attribute={'Title'} placeholder={"New Incident"} value={props.Title} changeHandler={props.setIncident}/>
                    <div style={{margin: 'auto', width: '10px'}}><FontAwesomeIcon icon={faEllipsisH} onClick={() => setShowmore(!showmore)} /></div>
                    <Collapse in={showmore}>
                        <div>
                            <Form.Group controlId={"incidentAssigned"}>
                                <Form.Label>Assigned To</Form.Label>
                                <Form.Control as={"select"}
                                              onChange={(e) => {props.setIncident({AssignedTo: e.target.value})}}
                                              value={props.AssignedTo }>
                                    {props.assigned.map((assigned) =>
                                        <option value={assigned.id} key={'assigned' + assigned.id}>{assigned.name}</option>)}
                                </Form.Control>
                            </Form.Group>

                        </div>
                    </Collapse>
                    <Form.Group controlId={"incidentAction"}>
                        <Form.Label>Action</Form.Label>
                        <Form.Control as={"select"}
                                      onChange={(e) => {props.setIncident({Action: e.target.value})}}
                                      value={props.Action }>
                            {props.actions.map((action) =>
                                <option value={action} key={'action' + action}>{action}</option>)}
                        </Form.Control>
                    </Form.Group>
                    <ModalFormField label='notes' attribute={'Notes'} placeholder={"..."} value={props.Notes} changeHandler={props.setIncident} controlAttributes={{as:"textarea", rows:"3"}}/>
                    <ModalFormField label='minutes' attribute={'Minutes'} placeholder={"⌚"} value={props.Minutes} changeHandler={props.setIncident}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={"primary"} type="submit">Add</Button>
                    <Button onClick={() => {props.setIncident({open: false})}}>Close</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

function ModalCustomerDetails(props) {
    return (
        <Modal show = {props.open} size={"lg"} centered >
            <Modal.Header>
                    <Modal.Title id ="customer-details-modal-title">
                        {props.company} Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul className={'list-group list-group-flush'}>
                        <li className={'list-group-item'}>
                            <a href={'tel:' + props["business phone"]}>{props["business phone"]}</a>
                        </li>
                        <li className={'list-group-item'}>
                            <a href={props.map_link}>{props.address} {props.city} {props["state/province"]}</a>
                        </li>
                        {props.sites.map( site => (
                            <React.Fragment key={'site'+site.id}>
                                <li className={'list-group-item list-group-item-dark'}>{site.sitename}</li>
                                <li className={'list-group-item'}>
                                    <a href={'tel:' + site.sitephone}>{site.sitephone}</a>
                                </li>
                                <li className={'list-group-item'}>
                                    <a href={site.map_link}>{site.siteaddr1} {site.siteaddr2} {site.sitecity} {site.sitestate}</a>
                                </li>
                            </React.Fragment>

                            )
                        )}
                    </ul>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={props.close}>Close</Button>
                </Modal.Footer>
        </Modal>
    )
}

class Company extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sites: [],
            contacts: [],
            connections: [],
            incidents: [],
            calls: [],
            machines: [],
            modalIncident: { open: false },
            modalCreateIncident: { open: false },
            modalConnection: { open: false },
            modalContact: {open: false},
            connection_search: '',
            filtered_connections: [],
            filtered_machines: [],
            detailsOpen: false
        };
        this.copyText = this.copyText.bind(this);
        this.connectionChange = this.connectionChange.bind(this);
        this.searchConnection = this.searchConnection.bind(this);
        this.handleCreateConnection = this.handleCreateConnection.bind(this);
        this.handleCreateContact = this.handleCreateContact.bind(this);
        this.handleCreateIncident = this.handleCreateIncident.bind(this);
        this.idleTimer = null
    }
    componentDidMount() {
        this.fetchController = new AbortController();
        this.fetchSites();
        this.fetchContacts();
        this.fetchConnections();
        this.fetchIncidents();
        this.fetchMachines();
    }
    fetchSites = () => {
        const signal = this.fetchController.signal;
        fetch('/customers/' + this.props.id + '/sites', {signal})
            .then(response => response.json())
            .then(sites => this.setState({sites}))
            .catch(error => {
                if (error.name === 'AbortError') return;
                throw error;
            });
    }
    fetchContacts = () => {
        const signal = this.fetchController.signal;
        fetch('/customers/' + this.props.id + '/contacts', {signal})
            .then(response => response.json())
            .then(contacts => this.setContactsState(contacts))
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
    fetchIncidents = () => {
        const signal = this.fetchController.signal;
        fetch('/customers/' + this.props.id + '/incidents', {signal})
            .then(   response => response.json())
            .then(  incidents => this.setState({ incidents }))
            .catch(error => {
                if (error.name === 'AbortError') return;
                throw error;
            });
    }
    fetchMachines = () => {
        const signal = this.fetchController.signal;
        fetch('/customers/' + this.props.id + '/machines', {signal})
            .then(response => response.json())
            .then(machines => {
                const filtered_machines = machines
                this.setState({machines, filtered_machines})
            })
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
    setContactsState = (response) => {
        const contacts = response.map(contact => {
            if (contact["e-mail"]) {
                const index = contact["e-mail"].indexOf("#")
                contact.email = (index > 0) ? contact["e-mail"].substring(0, index) : contact["e-mail"]
            } else {
                contact.email=''
            }
            return contact
        })
        this.setState({contacts})
    }
    componentWillUnmount() {
        this.fetchController.abort();
    }
    copyText = (e) => {
        e.preventDefault()
        const tempStor = document.createElement('textarea');
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
    searchMachine = (e) => {
        const machine_search = e.target.value;
        let terms = machine_search.toUpperCase().split(' ');
        const filtered_machines = this.state.machines.filter(mach => {
            return terms.every(term => {
                return Object.values(mach).join('').toUpperCase().indexOf(term) > -1;
            })
        })
        this.setState({machine_search, filtered_machines})

    }
    handleModalConnectionUpdate = (property) => {
        const modalConnection = Object.assign(this.state.modalConnection, property)
        this.setState(modalConnection)
    }
    handleModalContactUpdate = (property) => {
        const modalContact = Object.assign(this.state.modalContact, property)
        this.setState(modalContact)
    }
    handleModalIncidentUpdate = (property) => {
        const modalCreateIncident = Object.assign(this.state.modalCreateIncident, property)
        this.setState(modalCreateIncident)
    }
    setupFormData = (formData) => {
        const csrf_token = document.head.querySelector("[name~=csrf-token]").content
        formData.append('authenticity_token', csrf_token);
        formData.append('_method', 'POST');
        return formData
    }
    handleCreateConnection = (e) => {
        e.preventDefault();
        let formData = this.setupFormData(new FormData);
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
    handleCreateContact = (e) => {
        e.preventDefault();
        let formData=this.setupFormData(new FormData);
        formData.append('contact[customerid]', this.props.id)
        formData.append('contact[ContactName]', this.state.modalContact.ContactName)
        formData.append('contact[Office Phone]', this.state.modalContact.OfficePhone)
        formData.append('contact[Office Extension]', this.state.modalContact.OfficeExtension)
        formData.append('contact[Cell Phone]', this.state.modalContact.CellPhone)
        formData.append('contact[e-mail]', this.state.modalContact.email)
        fetch('/contacts/', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(json_response => {
                this.setState({modalContact: { open: false, ContactName: '', OfficePhone: '', OfficeExtension: '', CellPhone: '', email: '' }})
                this.fetchContacts()
            })

    }
    handleCreateIncident = (e) => {
        e.preventDefault();
        let formData=this.setupFormData(new FormData);
        formData.append('incident[Customer]', this.props.id)
        formData.append('incident[Contact]', this.state.modalCreateIncident.ContactName)
        formData.append('incident[Assigned To', this.state.modalCreateIncident.AssignedTo)
        formData.append('incident[Title]', this.state.modalCreateIncident.Title)
        formData.append('call[Action]', this.state.modalCreateIncident.Action)
        formData.append('call[Notes]', this.state.modalCreateIncident.Notes)
        formData.append('call[Minutes]', this.state.modalCreateIncident.Minutes)
        fetch('/incidents/', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(json_response => {
                this.setState({modalCreateIncident: { open: false }})
                this.fetchContacts()
            })

    }

    render () {
    return (
      <React.Fragment>
          <IdleTimer  ref={ref => { this.idleTimer = ref }}
                      element={document}
                      onIdle={() => {window.location="/customers"}}
                      debounce={250}
                      timeout={1000 * 60 * 15} />
          <h1>{this.props.company} <FontAwesomeIcon icon={faInfoCircle} onClick={() => this.setState({detailsOpen: true})} style={{color: '33A5FF'}}/></h1>
          <Accordion>
              <Card className="card-collapse">
                  <Card.Header className={"row"}>
                      <Col sm={6}>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                              <h5>Contacts</h5>
                          </Accordion.Toggle>
                          <Button variant="primary" className="text-left" style={{float:'right'}}
                                  onClick={() => this.handleModalContactUpdate({open: true, ContactName: '', OfficePhone: '', OfficeExtension: '', CellPhone: '', email: ''})}>
                              <FontAwesomeIcon icon={faPlus} /> New
                          </Button>
                      </Col>
                      <Col />
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                      <Card.Body>

                          <div className="d-none d-md-flex contact-header row">
                                  <div className="col-sm">
                                      <span>Name</span>

                                  </div>
                                  <div className="col-sm">Office</div>
                                  <div className="col-sm">Extension</div>
                                  <div className="col-sm">Cell</div>
                                  <div className="col-sm">E-mail</div>
                          </div>
                          {this.state.contacts.map((contact,key) =>
                              <div key={"contact" + contact.id} className="row contact-record">
                                  <div className="col-sm">
                                      <Button size={"sm"} variant={"success"}
                                            onClick={() => {this.handleModalIncidentUpdate({open: true, ContactName: contact.contactname, Title: '', Minutes: '', Notes: '', contactid: contact.id, Action: this.props.actions[0], AssignedTo: this.props.employee_id})}}>
                                          <FontAwesomeIcon icon={faPlusCircle} />
                                      </Button>
                                      <span style={{paddingLeft:8}}>{contact.contactname}</span>

                                  </div>
                                  <div className="col-sm"><a href={'tel:'+ contact["office phone"]}>{contact["office phone"]}</a></div>
                                  <div className="col-sm">{contact["office extension"]}</div>
                                  <div className="col-sm"><a href={'tel:'+ contact["cell phone"]}>{contact["cell phone"]}</a></div>
                                  <div className="col-sm"><a href={'mailto:'+ contact.email}>{contact.email}</a></div>
                              </div>
                          )}
                      </Card.Body>
                  </Accordion.Collapse>
              </Card>
              <Card>
                  <Card.Header className={"row"}>
                      <Col sm={6}>
                          <Accordion.Toggle as={Button} variant="link" eventKey="ConnectionCollapse" >
                              <h5>Connections</h5>
                          </Accordion.Toggle>

                          <Button variant="primary" className="text-left" style={{float: 'right'}}
                                  onClick={() => this.setState({modalConnection: { open: true, description: '', userName: '', password: '', address: '', notes: '', deviceType: '' }})}>
                              <FontAwesomeIcon icon={faPlus} /> New
                          </Button>
                      </Col>
                      <Col sm>
                          <MachineSearchForm value={this.state.connection_search} onChange={this.searchConnection}
                          onClick={(e) => window.scrollTo(0,e.target.offsetTop)}/>
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
                          <h5>Incidents</h5>
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
              <Card>
                  <Card.Header className={"row"}>
                      <Col sm={6}>
                        <Accordion.Toggle as={Button} variant="link" eventKey="MachineCollapse">
                           <h5>Machines</h5>
                        </Accordion.Toggle>
                      </Col>
                      <Col sm>
                        <MachineSearchForm value={this.state.machine_search} onChange={this.searchMachine} />
                      </Col>

                  </Card.Header>
                  <Accordion.Collapse eventKey="MachineCollapse">
                      <Card.Body>
                          <div className="d-none d-md-flex contact-header row">
                              <div className="col-sm">Name</div>
                              <div className="col-sm">Login</div>
                              <div className="col-sm">OS</div>

                          </div>
                          {this.state.filtered_machines.map((machine,key) =>
                              <div key={"machine" + machine.agentguid} className="row contact-record">
                                  <div className="col-sm"><a href={machine.live_connect}>{machine.machname}</a></div>
                                  <div className="col-sm">
                                      {machine.lastloginname}
                                  </div>
                                  <div className="col-sm">{machine.ostype}</div>

                              </div>
                          )}
                      </Card.Body>
                  </Accordion.Collapse>
              </Card>
          </Accordion>

          <ModalCreateConnection {...this.state.modalConnection} setConnection={this.handleModalConnectionUpdate}
                                 handleCreateConnection={this.handleCreateConnection} company={this.props.company}
                                 device_types={this.props.device_types}
          />
          <ModalCreateContact {...this.state.modalContact} setContact={this.handleModalContactUpdate}
                              company={this.props.company} handleCreateContact={this.handleCreateContact}
           />
          <ModalCreateIncident {...this.state.modalCreateIncident} setIncident={this.handleModalIncidentUpdate}
                              handleCreateIncident={this.handleCreateIncident} actions={this.props.actions}
                               assigned={this.props.assigned}
          />
          <ModalIncident {...this.state.modalIncident} company={this.props.company} calls={this.state.calls}
                         closeHandler={() => this.setState({modalIncident: {open: false}})}
          />
          <ModalCustomerDetails {...this.props} sites={this.state.sites} open={this.state.detailsOpen}
                                close={() => this.setState({detailsOpen:false})}
          />

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