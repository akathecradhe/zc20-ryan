import React from 'react';
import { Redirect } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  Button, Form
} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Moment from 'react-moment';
import Footer from './common/Footer';
import Progress from './common/Progress';

library.add(faTrash);

class Logs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      isAuthenticated: true,
      isOpen: false
    };
    this.openModal = () => this.setState({ isOpen: true });
    this.closeModal = () => this.setState({ isOpen: false });
    this.handlePurge = this.handlePurge.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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
            isAuthenticated: false,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          isAuthenticated: false,
        });
      });
  }

  componentDidMount() {
    this.loadResults();
  }

  loadResults() {
    const { isAuthenticated } = this.state;
    if (isAuthenticated === true) {
      fetch('/api/calc/results', {
        method: 'GET',
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((data) => {
          this.setState({
            results: data.results,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  handleDelete(id) {
    const { results } = this.state;
    fetch('/api/calc/delete-result', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(() => {
        const newResults = results.filter(obj => obj[4] !== id);

        this.setState({
          results: newResults,
        });
      });
  }

  handlePurge() {
    fetch('/api/calc/delete-participant-results', {
      method: 'DELETE'
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(() => {
        this.setState({
          results: [],
          isOpen: false
        });
      }).catch((err) => {
        console.error(err);
      });
  }

  render() {
    const { results, isAuthenticated, isOpen } = this.state;

    return !isAuthenticated ? (
      <Redirect to="/login" />
    ) : (
      <>
        <div>
          <main className="no-margins">
            <Row>
              <Col className="content" xs={9}>
                <Container fluid="md">
                  <h3 className="mt-4">Logs</h3>
                  {(results.length === 0) && (
                  <p>
                    You do not have any logs yet.
                  </p>
                  )}
                  {(results.length > 0) && (
                    <>
                      <table className="table mb-4">
                        <thead>
                          <tr>
                            <th scope="col">Category</th>
                            <th scope="col">Input</th>
                            <th scope="col">Result</th>
                            <th scope="col">Time</th>
                            <th scope="col" />
                          </tr>
                        </thead>
                        <tbody>
                          {Object.values(results).map(item => (
                            <tr key={item[4]} id={item[4]}>
                              <td>{item[1]}</td>
                              <td>
                                <strong>{item[0]}</strong>
                              </td>
                              <td>
                                <strong>{item[2]}</strong>
                                <span className="unit">kg CO2e</span>
                              </td>
                              <td>
                                <Moment fromNow>{item[3]}</Moment>
                              </td>
                              <td>
                                <span
                                  className="delete-result"
                                  onClick={() => this.handleDelete(item[4])}
                                  onKeyPress={() => this.handleDelete(item[4])}
                                  role="button"
                                  tabIndex={0}
                                >
                                  <FontAwesomeIcon icon={['fas', 'trash']} />
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <Button
                        variant="danger"
                        type="submit"
                        size="lg"
                        disabled={!results}
                        onClick={this.openModal}
                        onKeyPress={this.openModal}
                      >
                        Reset Logs
                      </Button>
                      {' '}
                      <Button href="/calculator" variant="secondary" size="lg">
                        Back to Calculator
                      </Button>
                    </>
                  )}
                </Container>
              </Col>
              <Col className="sidebar">
                <Progress />
              </Col>
            </Row>

            <Modal show={isOpen} onHide={this.closeModal}>
              <Form>
                <Modal.Header closeButton>
                  <Modal.Title>Reset Logs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p className="text-muted no-top-margin">
                    Are you sure that you want to reset your logs?
                  </p>
                  <p className="text-muted no-margins">
                    <strong>
                      This action will delete all of your results and
                      cannot be reversed.
                    </strong>
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.closeModal}>
                    Close
                  </Button>
                  <Button
                    variant="danger"
                    onClick={this.handlePurge}
                  >
                    Reset!
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>

          </main>
          <Footer />
        </div>
      </>
    );
  }
}

export default Logs;
