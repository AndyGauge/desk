import React, { Component} from "react"
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
    }
  render () {

    return (
      <React.Fragment>
          {this.contacts = this.state.contacts.map((contact,key) =>
              <li key={contact.id}>{contact.ContactName}</li>
          )}
      </React.Fragment>
    );
  }
}

Company.propTypes = {
  id: PropTypes.node,
  name: PropTypes.string
};
export default Company