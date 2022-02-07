import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Form, Button, Container, Alert
} from 'react-bootstrap';

class LinkAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      word1: '',
      word2: '',
      word3: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        if (data.type !== 'participant') {
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

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }


  handleSubmit(event) {
    event.preventDefault();
    if (!event.target.checkValidity()) {
      return;
    }

    const { word1, word2, word3 } = this.state;

    this.setState({ errorMessage: null });
    const passphrase = `${word1.trim()}-${word2.trim()}-${word3.trim()}`;
    fetch('/api/participants/linkPassphrase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        passphrase,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(() => {
        this.setState({ successMessage: 'Account linked successfully.' });
        setTimeout(() => {
          this.setState({
            redirect: true,
          });
        }, 2000);
      })
      .catch((err) => {
        err.json().then((errorMessage) => {
          this.setState({ errorMessage: errorMessage.message });
        });
      });
  }

  render() {
    const {
      word1,
      word2,
      word3,
      errorMessage,
      successMessage,
      redirect,
    } = this.state;
    const isValid = word1.length > 0 && word2.length > 0 && word3.length > 0;

    if (redirect) {
      return <Redirect to="/" />;
    }

    return (
      <Container className="mt-5 smaller">
        <h3>Link Account</h3>
        <Form className="mt-4" onSubmit={this.handleSubmit}>
          <Alert variant="warning">
            A passphrase is a unique combination of three words given to you by
            an organisation. Enter a passphrase below to link your account with
            a specific organisation.
          </Alert>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form.Group>
            <Form.Label>Passphrase</Form.Label>
            <Container className="flex-container">
              <div className="flex-item">
                <Form.Control
                  type="text"
                  placeholder="Word 1"
                  name="word1"
                  value={word1}
                  onChange={this.handleChange}
                  required
                  autoFocus
                />
              </div>
              <div className="flex-item">
                <span className="separator">-</span>
              </div>
              <div className="flex-item">
                <Form.Control
                  type="text"
                  placeholder="Word 2"
                  name="word2"
                  value={word2}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="flex-item">
                <span className="separator">-</span>
              </div>
              <div className="flex-item">
                <Form.Control
                  type="text"
                  placeholder="Word 3"
                  name="word3"
                  value={word3}
                  onChange={this.handleChange}
                  required
                />
              </div>
            </Container>
          </Form.Group>
          <Button variant="primary" size="lg" type="submit" disabled={!isValid}>
            Link Account
          </Button>
        </Form>
      </Container>
    );
  }
}

export default LinkAccount;
