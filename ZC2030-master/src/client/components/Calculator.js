import React, { Component } from 'react';
import {
  Form, Button, Container
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Footer from './common/Footer';
import Progress from './common/Progress';

const cookies = new Cookies();

library.add(faQuestionCircle);

class Calculator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: '',
      categoryName: '',
      categories: '',
      input: '',
      inputName: '',
      inputs: '',
      quantity: '',
      unit: '',
      result: '',
      step: 1,
      isOpen: false,
      type: cookies.get('type')
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.openModal = () => this.setState({ isOpen: true });
    this.closeModal = () => this.setState({ isOpen: false });
  }

  componentDidMount() {
    // Get categories for this type
    fetch('/api/calc/category', {
      method: 'GET'
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ categories: data });
      })
      .catch((err) => {
        console.error(err);
      });

    // Get type of calculator for this user
    fetch('/api/auth/info', {
      method: 'GET'
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((data) => {
        if (data.organisationTypeName) {
          this.setState({ type: data.organisationTypeName });
        } else {
          this.setState({ type: 'Individual' });
        }
      })
      .catch(() => {
        // console.error(err);
        this.setState({ type: 'Individual' });
      });
  }

  handleChange(event) {
    const { name, value } = event.target;
    const {
      step, categories, inputs
    } = this.state;

    this.setState({ [name]: value });

    // When the user selects a category
    if (step === 1 && value > 0) {
      Object.values(categories).forEach((item) => {
        if (parseInt(item.id, 10) === parseInt(value, 10)) {
          this.setState({
            categoryName: item.name
          });
        }
      });

      fetch('/api/calc/category-inputs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: value
        })
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((data) => {
          this.setState({ inputs: data });
        })
        .catch((err) => {
          console.error(err);
        });
    }

    // When the user selects an input
    if (step === 2) {
      Object.values(inputs).forEach((item) => {
        if (parseInt(item.id, 10) === parseInt(value, 10)) {
          this.setState({
            unit: item.unit,
            inputName: item.name
          });
        }
      });
    }
  }


  handleNext() {
    this.setState(prevState => ({
      step: prevState.step + 1
    }));

    const {
      step, input, quantity
    } = this.state;

    // Results page
    if (step === 3) {
      fetch('/api/calc/new-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputId: input,
          amount: quantity
        })
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((data) => {
          this.setState({ result: data.result });
        })
        .catch((err) => {
          console.error(err);
        });
    }

    // Start again
    if (step === 4) {
      this.setState({
        category: '',
        categoryName: '',
        input: '',
        inputName: '',
        inputs: '',
        quantity: '',
        unit: '',
        result: '',
        step: 1
      });
    }
  }

  render() {
    const {
      category, categories, categoryName, input, inputs,
      inputName, quantity, unit, step, result, isOpen, type
    } = this.state;
    return (
      <>
        <div>

          <main className="no-margins">
            <Row>
              <Col className="calculator content" xs={9}>
                <Container fluid="md">

                  <Form>

                    {type && (
                    <h2>
                      {type}
                      {' '}
                      Calculator
                      <span
                        className="help-link"
                        onClick={() => this.openModal()}
                        onKeyPress={() => this.openModal()}
                        role="button"
                        tabIndex={0}
                      >
                        <FontAwesomeIcon icon={['fas', 'question-circle']} />
                      </span>
                    </h2>
                    )}

                    {step === 1 && (
                      <>
                        <h3>
                          Select a category...
                        </h3>
                          {
                            Object.values(categories).map((item => (
                              <div key={item.id}>
                                <Form.Check
                                  custom
                                  type="radio"
                                  id={`custom-radio item-${item.id}`}
                                  name="category"
                                  label={item.name}
                                  value={item.id}
                                  onChange={this.handleChange}
                                />
                              </div>
                            )))
                          }
                        <div>
                          <Button variant="primary" size="lg" type="submit" disabled={!category} onClick={this.handleNext}>
                            Next
                          </Button>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <h3>
                          Select an input...
                        </h3>
                        {
                          Object.values(inputs).map((item => (
                            <div key={item.id}>
                              <Form.Check
                                custom
                                type="radio"
                                id={`custom-radio item-${item.id}`}
                                name="input"
                                label={item.name}
                                value={item.id}
                                onChange={this.handleChange}
                              />
                            </div>
                          )))
                        }
                        <div>
                          <Button variant="primary" size="lg" disabled={!input} onClick={this.handleNext}>
                            Next
                          </Button>
                        </div>
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <h3>
                          Enter an amount...
                        </h3>
                        <p className="text-muted">
                          Enter an amount in
                          {' '}
                          {
                            unit
                          }
                          {' '}
                          for
                          {' '}
                          <strong>
                            {categoryName}
                            {' '}
                            -
                            {' '}
                            {inputName}
                          </strong>
                          .
                        </p>
                        <div key="custom-radio" className="mb-3">
                          <Form.Control type="number" placeholder={`In ${unit}...`} name="quantity" onChange={this.handleChange} className="mt-3" required autoFocus />
                        </div>
                        <div>
                          <Button variant="primary" size="lg" disabled={!quantity} onClick={this.handleNext}>
                            Calculate!
                          </Button>
                        </div>
                      </>
                    )}

                    {step === 4 && (
                      <>
                        <h3>
                          Done!
                        </h3>
                        <p className="text-muted">
                          Your result for
                          {' '}
                          <strong>
                            {categoryName}
                            {' '}
                            -
                            {' '}
                            {inputName}
                          </strong>
                          {' '}
                          has been logged:
                        </p>
                        <div key="custom-radio" className="mb-3">
                          <big className="result">
                            {result}
                            <span className="unit">
                              kg CO2e
                            </span>
                          </big>
                        </div>
                        <div>
                          <Button variant="primary" type="submit" size="lg" onClick={this.handleNext}>
                            Start Again!
                          </Button>
                          {' '}
                          <Button href="/logs" variant="secondary" type="submit" size="lg">
                            View Logs
                          </Button>
                        </div>
                      </>
                    )}

                  </Form>
                  <Modal show={isOpen} onHide={this.closeModal}>
                    <Form>
                      <Modal.Header closeButton>
                        <Modal.Title>
                          Calculator Types
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p className="text-muted no-top-margin">
                          You are currently using the
                          {' '}
                          <strong>{type}</strong>
                          {' '}
                          calculator.
                          {' '}
                        </p>
                        <p className="text-muted">
                          We personalise the type of calculator that is shown to you depending on if you have linked your account to an organisation and the type of that organisation.
                        </p>
                        <p className="text-muted no-margins">
                          <strong>Want to use a different calculator?</strong>
                          {' '}
                          <Link to="/link" className="initial">Link your account</Link>
                          {' '}
                          to an organisation of another type or
                          {' '}
                          <Link to="/signup" className="initial">create an individual account</Link>
                          {' '}
                          instead.
                        </p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>
                          Got it!
                        </Button>
                      </Modal.Footer>
                    </Form>
                  </Modal>
                </Container>
              </Col>
              <Col className="sidebar">
                <Progress data={this.state} />
              </Col>
            </Row>
          </main>
          <Footer />
        </div>
      </>
    );
  }
}

export default Calculator;
