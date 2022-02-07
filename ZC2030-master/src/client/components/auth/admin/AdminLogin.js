import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import {
  Form, Button, Container, Alert
} from 'react-bootstrap';

class AdminLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      isAuthenticated: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

    const { username, password } = this.state;

    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        type: 'admin'
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
      username, password, errorMessage, successMessage, isAuthenticated
    } = this.state;
    const isValid = username.length > 0 && password.length > 0;
    return (
      <Container className="mt-5 smaller">
        {(isAuthenticated) && (
          <>
            <Redirect to="/" />
          </>
        )
        }
        <h3>Admin Login</h3>
        <Form className="mt-4" onSubmit={this.handleSubmit}>
          <Alert variant="warning">
            This form is for logging in as a website administrator only.
            If you have a trainer account, please log in
            {' '}
            <Link to="/trainer-login">here</Link>
            {' '}
            instead.
          </Alert>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" name="username" value={username} onChange={this.handleChange} required autoFocus />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" name="password" value={password} onChange={this.handleChange} required />
          </Form.Group>
          <Button variant="primary" size="lg" type="submit" disabled={!isValid}>
            Log In
          </Button>
        </Form>
      </Container>
    );
  }
}

export default AdminLogin;
