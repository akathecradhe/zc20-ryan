import React, { Component } from 'react';
import {
  Form, Button, Container, Alert
} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

class CreateTrainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      canManage: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  componentWillMount() {
    // Get the type of this user
    fetch('api/auth/info', {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((data) => {
        if (data.type !== 'trainer' || data.canManage !== true) {
          this.setState({
            redirect: true,
          });
        }
      })
      .catch(() => {
        this.setState({
          redirect: true,
        });
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!event.target.checkValidity()) {
      return;
    }
    this.setState({ errorMessage: null });

    const {
      firstName, lastName, username, password, canManage
    } = this.state;

    fetch('/api/trainers/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        username,
        password,
        canManage,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(() => {
        console.log(canManage);
        this.setState({
          successMessage: `Successfully created ${username}. Please provide this trainer with their username and password.`,
        });
        this.setState({
          username: '',
          password: '',
          firstName: '',
          lastName: '',
          canManage: false,
        });
      })
      .catch((err) => {
        err.json().then((errorMessage) => {
          this.setState({ errorMessage: errorMessage.message });
        });
      });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleCheck() {
    const { canManage } = this.state;
    this.setState({
      canManage: !canManage
    });
  }

  render() {
    const {
      username,
      password,
      firstName,
      lastName,
      canManage,
      errorMessage,
      successMessage,
      redirect,
    } = this.state;

    const isValid = username.length > 0
      && password.length > 0
      && firstName.length > 0
      && lastName.length > 0;

    if (redirect) {
      return <Redirect to="/trainer-login" />;
    }

    return (
      <Container className="mt-5 smaller">
        <h3>Create Trainer</h3>
        <Form className="mt-4" onSubmit={this.handleSubmit}>
          <Alert variant="warning">
            Trainers can generate passphrases to link an account to the trainer
            and to the organisation.
          </Alert>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form.Group controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              name="firstName"
              value={firstName}
              onChange={this.handleChange}
              required
              autoFocus
            />
          </Form.Group>
          <Form.Group controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={lastName}
              onChange={this.handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={this.handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={this.handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="canManage">
            <Form.Check
              type="checkbox"
              name="canManage"
              checked={canManage}
              onChange={this.handleCheck}
              label="Allow this trainer to create trainers and manage the organisation."
            />
          </Form.Group>
          <Button variant="primary" size="lg" type="submit" disabled={!isValid}>
            Create
          </Button>
        </Form>
      </Container>
    );
  }
}

export default CreateTrainer;
