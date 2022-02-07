import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ClickToSelect from '@mapbox/react-click-to-select';

import {
  Form, Button, Container, Alert
} from 'react-bootstrap';

class Generate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passphrase: '',
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
        if (data.type !== 'trainer') {
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
    this.setState({ errorMessage: null });

    fetch('/api/trainers/generatePassphrase/', {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ passphrase: data.passphrase });
      })
      .catch((err) => {
        err.json().then((errorMessage) => {
          this.setState({ errorMessage: errorMessage.message });
        });
      });
  }

  render() {
    const { passphrase, errorMessage, redirect } = this.state;

    if (redirect) {
      return <Redirect to="/trainer-login" />;
    }

    return (
      <Container className="mt-5 smaller">
        <h3>Generate Passphrase</h3>
        <Form className="mt-4" onSubmit={this.handleSubmit}>
          <Alert variant="warning">
            A passphrase is a unique combination of three words. Users can enter
            your passphrase to link their account to your organisation.
          </Alert>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Button variant="primary" size="lg" block type="submit">
            Generate Passphrase
          </Button>
          {passphrase && (
            <>
              <ClickToSelect>
                <p className="passphrase mt-3">{passphrase}</p>
              </ClickToSelect>
              <p className="text-muted">
                Share this passphrase with anyone who you want to be able to
                link their account to your organisation.
                <strong>
                  Do not share your passphrase outside of your organisation.
                </strong>
              </p>
            </>
          )}
        </Form>
      </Container>
    );
  }
}

export default Generate;
