import React, { Component} from "react"
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'

import PropTypes from "prop-types"
class Company extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contacts: [],
            connections: [],
            incidents: [],
            calls: [],
            modalOpen: false,
            modalClass: '',
            modalContent: '',
            modalIncident: '',
        };
    }
    componentDidMount() {
        fetch('http://localhost:3000/customers/' + this.props.id + '/contacts')
            .then(   response => response.json())
            .then(   contacts => this.setState({ contacts }));
        fetch('http://localhost:3000/customers/' + this.props.id + '/connections')
            .then(   response => response.json())
            .then(connections => this.setState({ connections }));
        fetch('http://localhost:3000/customers/' + this.props.id + '/incidents')
            .then(   response => response.json())
            .then(  incidents => this.setState({ incidents }));
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
                          {this.contacts = this.state.contacts.map((contact,key) =>
                              <div key={contact.Id} className="row contact-record">
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
                  <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey="1">
                          Connections
                      </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="1">
                      <Card.Body>
                          <div className="d-none d-md-flex contact-header row">
                              <div className="col-sm">Type</div>
                              <div className="col-sm">Address</div>
                              <div className="col-sm">User</div>
                              <div className="col-sm">Password</div>
                              <div className="col-sm">Description</div>
                          </div>
                          {this.connections = this.state.connections.map((connection,key) =>
                              <div key={connection.ID} className="row contact-record">
                                  <div className="col-sm">{connection.Type}</div>
                                  <div className="col-sm"><a href={connection.Address} target="_blank">{connection.Address}</a></div>
                                  <div className="col-sm">{connection.UserId}</div>
                                  <div className="col-sm">{connection.Password}</div>
                                  <div className="col-sm">{connection.Description}</div>
                              </div>
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
                          {this.connections = this.state.incidents.map((incident,key) =>
                              <div key={incident.ID} className="row contact-record">
                                  <div className="col-sm">{incident.OpenedDate}</div>
                                  <div className="col-sm">
                                      <Button variant="link" className="text-left" onClick={() => this.setState({ modalClass: 'Incident', modalContent: this.render_incident(incident), modalOpen: true })}>{incident.Title}</Button>
                                  </div>
                                  <div className="col-sm">{incident.Tech}</div>
                                  <div className="col-sm">{incident.Status}</div>
                              </div>
                          )}
                      </Card.Body>
                  </Accordion.Collapse>
              </Card>
          </Accordion>

          <Modal
              show={this.state.modalOpen}
              size="lg"
              aria-labelledby="customer-modal-title"
              centered
          >
              <Modal.Header>
                  <Modal.Title id="customer-modal-title">
                      {this.props.company} {this.state.modalClass}
                  </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Row>
                      <Col>{this.state.modalIncident.Title}</Col>
                      <Col>Opened</Col>
                      <Col>Closed</Col>
                  </Row>
                  <Row>
                      <Col>{this.state.modalIncident.Status}</Col>
                      <Col>{this.state.modalIncident.OpenedDate}</Col>
                      <Col>{this.state.modalIncident.ClosedDate}</Col>
                  </Row>
                  <Row>
                      <Col>Contact</Col>
                      <Col>{this.state.modalIncident.Contact}</Col>
                  </Row>
                  <Row>
                      <Col>Problem</Col>
                      <Col>{this.state.modalIncident.Problem}</Col>
                  </Row>
                  <Row>
                      <Col>Solution</Col>
                      <Col>{this.state.modalIncident.Solution}</Col>
                  </Row>
                  {this.state.calls.map((callEvent, key) =>
                      <Row>
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
                  <Button onClick={() => this.setState({modalOpen: false})}>Close</Button>
              </Modal.Footer>
          </Modal>

      </React.Fragment>
    );
  }

    render_incident = (incident) => {
        fetch('http://localhost:3000/incidents/' + incident.Id + '/events')
            .then(   response => response.json())
            .then(calls => this.setState({calls}))
    }
}
Company.propTypes = {
  id: PropTypes.node,
  name: PropTypes.array
};
export default Company