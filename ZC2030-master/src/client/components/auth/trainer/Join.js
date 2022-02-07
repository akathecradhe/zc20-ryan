import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import {
  Form, Button, Container, Alert
} from 'react-bootstrap';

class Join extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      orgName: '',
      type: 'DEFAULT',
      types: '',
      isAuthenticated: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch('/api/organisations/types', {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ types: data });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!event.target.checkValidity()) {
      return;
    }
    this.setState({ errorMessage: null });

    const {
      orgName, firstName, lastName, username, password, type
    } = this.state;

    // Create an organisation
    fetch('/api/organisations/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: orgName,
        firstName,
        lastName,
        username,
        password,
        type
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(() => {
        this.setState({ isAuthenticated: true });
      })
      .catch((err) => {
        err.json()
          .then((errorMessage) => {
            this.setState({ errorMessage: errorMessage.message });
          });
      });
  }

  render() {
    const {
      username, password, firstName, lastName, orgName, types, type, errorMessage, successMessage,
      isAuthenticated
    } = this.state;

    const isValid = username.length > 0 && password.length > 0 && firstName.length > 0
      && lastName.length > 0 && orgName.length > 0;

    return (
      <Container className="mt-5 smaller">
        {(isAuthenticated) && (
          <>
            <Redirect to="/" />
          </>
        )
        }
        <h3>Organisation Sign Up</h3>
        <Form className="mt-4" onSubmit={this.handleSubmit}>
          <Alert variant="warning">
            This form is for signing up your organisation to the platform.
            This will allow participants to link their accounts to your organisation.
          </Alert>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form.Group controlId="orgName">
            <Form.Label>Organisation Name</Form.Label>
            <Form.Control type="text" placeholder="Organisation Name" name="orgName" value={orgName} onChange={this.handleChange} required autoFocus />
          </Form.Group>
          <Form.Group controlId="type">
            <Form.Label>Organisation Type</Form.Label>
            <Form.Control
              as="select"
              name="type"
              onChange={this.handleChange}
              value={type}
              required
            >
              <option disabled value="DEFAULT">
                Select one...
              </option>
              {Object.values(types).map(item => (
                <option
                  key={item.id}
                  value={item.id}
                  onChange={this.handleChange}
                >
                  {item.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <hr />
          <Form.Group controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="First Name" name="firstName" value={firstName} onChange={this.handleChange} required />
          </Form.Group>
          <Form.Group controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="Last Name" name="lastName" value={lastName} onChange={this.handleChange} required />
          </Form.Group>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" name="username" value={username} onChange={this.handleChange} required />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" name="password" value={password} onChange={this.handleChange} required />
          </Form.Group>
          <Button variant="primary" size="lg" type="submit" disabled={!isValid}>
            Sign Up
          </Button>
          <Form.Text className="text-muted">
            <p>
              <Link to="/trainer-login">Already have an account?</Link>
            </p>
            <p className="disclaimer">
              By creating an account, you confirm that you have read and agreed to our
              {' '}
              <a href="/terms">Terms of Service</a>
              {' '}
              and
              {' '}
              <a href="/privacy">Privacy Policy</a>
              .
            </p>
          </Form.Text>
        </Form>
      </Container>
    );
  }
}

export default Join;
