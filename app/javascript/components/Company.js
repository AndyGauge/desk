import React, { Component} from "react"
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

import PropTypes from "prop-types"
class Company extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contacts: [],
            connections: [],
        };
    }
    componentDidMount() {
        fetch('http://localhost:3000/customers/' + this.props.id + '/contacts')
            .then(response => response.json())
            .then(contacts => this.setState({ contacts }));
        fetch('http://localhost:3000/customers/' + this.props.id + '/connections')
            .then(response => response.json())
            .then(connections => this.setState({ connections }));
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
                              <div key={contact.ContactName} className="row contact-record">
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
                                  <div className="col-sm"><a href={connection.Address}>{connection.Address}</a></div>
                                  <div className="col-sm">{connection.UserId}</div>
                                  <div className="col-sm">{connection.Password}</div>
                                  <div className="col-sm">{connection.Description}</div>
                              </div>
                          )}
                      </Card.Body>
                  </Accordion.Collapse>
              </Card>
          </Accordion>




      </React.Fragment>
    );
  }
}

Company.propTypes = {
  id: PropTypes.node,
  name: PropTypes.array
};
export default Company