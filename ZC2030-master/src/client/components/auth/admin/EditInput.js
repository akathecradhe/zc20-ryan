import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Form, Button, Container, Alert
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';

library.add(faTimes);

class EditInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: 'DEFAULT',
      input: 'DEFAULT',
      name: '',
      factor: '',
      unit: '',
      categories: '',
      inputs: '',
      isOpen: false,
      deleteMode: '',
      types: '',
      type: 'DEFAULT'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.setDeleteMode = this.setDeleteMode.bind(this);
    this.openModal = () => this.setState({ isOpen: true });
    this.closeModal = () => this.setState({ isOpen: false });
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
        if (data.type !== 'admin') {
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

  setDeleteMode(mode) {
    this.setState({
      deleteMode: mode,
    });
    this.openModal();
  }


  handleSubmit(event) {
    event.preventDefault();

    if (!event.target.checkValidity()) {
      return;
    }
    this.setState(
      {
        errorMessage: null,
        successMessage: null
      }
    );

    const {
      input, name, factor, unit
    } = this.state;

    fetch('/api/calc/update-input', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: input,
        name,
        factor,
        unit,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(() => {
        this.setState({ successMessage: `${name} updated successfully.` });
        this.setState({
          name: '',
          factor: '',
          unit: '',
          input: 'DEFAULT',
          category: 'DEFAULT',
          type: 'DEFAULT'
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

    this.setState(
      {
        errorMessage: null,
        successMessage: null
      }
    );

    // Type is updated
    if (name === 'type' && value) {
      fetch('/api/calc/categories-from-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: value,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((data) => {
          this.setState({
            categories: data,
            category: 'DEFAULT'
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }

    // Category is updated
    if (name === 'category' && value) {
      fetch('/api/calc/category-inputs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: value,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((data) => {
          this.setState({
            inputs: data,
            input: 'DEFAULT',
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }

    // Input is updated
    if (name === 'input' && value) {
      const { inputs } = this.state;
      Object.values(inputs).forEach((item) => {
        if (parseInt(item.id, 10) === parseInt(value, 10)) {
          this.setState({
            unit: item.unit,
            name: item.name,
            factor: item.factor,
          });
        }
      });
    }
  }

  handleDelete(event) {
    event.preventDefault();
    if (!event.target.checkValidity()) {
      return;
    }

    this.setState(
      {
        errorMessage: null,
        successMessage: null
      }
    );

    const {
      input, category, type, name, deleteMode
    } = this.state;

    if (deleteMode === 'Input') {
      fetch('/api/calc/delete-input', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: input,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then(() => {
          this.setState({
            successMessage: `${name} deleted successfully.`,
          });
          this.setState({
            name: '',
            factor: '',
            unit: '',
            input: 'DEFAULT',
            category: 'DEFAULT',
            type: 'DEFAULT'
          });
        })
        .catch((err) => {
          err.json().then((errorMessage) => {
            this.setState({
              errorMessage: errorMessage.message,
            });
          });
        });
    } else if (deleteMode === 'Category') {
      fetch('/api/calc/delete-category', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: category,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then(() => {
          this.setState({
            successMessage: 'Category deleted successfully.',
          });
          this.setState({
            name: '',
            factor: '',
            unit: '',
            input: 'DEFAULT',
            category: 'DEFAULT',
            type: 'DEFAULT'
          });
          // Fetch categories again
          fetch('/api/calc/category', {
            method: 'GET',
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
        })
        .catch((err) => {
          err.json().then((errorMessage) => {
            this.setState({
              errorMessage: errorMessage.message,
            });
          });
        });
    } else if (deleteMode === 'Type') {
      fetch('/api/organisations/delete-type', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then(() => {
          this.setState({
            successMessage: 'Type deleted successfully.',
          });
          this.setState({
            name: '',
            factor: '',
            unit: '',
            input: 'DEFAULT',
            category: 'DEFAULT',
            type: 'DEFAULT'
          });
          // Fetch categories again
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
        })
        .catch((err) => {
          err.json().then((errorMessage) => {
            this.setState({
              errorMessage: errorMessage.message,
            });
          });
        });
    }

    // Close the modal whatever happens
    this.closeModal();
  }

  render() {
    const {
      name,
      factor,
      unit,
      category,
      input,
      errorMessage,
      successMessage,
      categories,
      inputs,
      redirect,
      isOpen,
      deleteMode,
      type,
      types
    } = this.state;
    const isValid = category !== 'DEFAULT'
      && input !== 'DEFAULT'
      && name.length > 0
      && factor
      && unit.length > 0;

    if (redirect) {
      return <Redirect to="/admin-login" />;
    }

    return (
      <>
        <Container className="mt-5 smaller">
          <h3>Edit Input</h3>
          <Form className="mt-4" onSubmit={this.handleSubmit}>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}
            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
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

            {type !== 'DEFAULT' && type !== '1' && (
              <span
                className="modal-link remove"
                onClick={() => this.setDeleteMode('Type')}
                onKeyPress={() => this.setDeleteMode('Type')}
                role="button"
                tabIndex={0}
              >
                <FontAwesomeIcon icon={['fas', 'times']} />
                <small>Remove Type</small>
              </span>
            )}

            {type !== 'DEFAULT' && (
              <>
                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    name="category"
                    onChange={this.handleChange}
                    value={category}
                    required
                  >
                    <option disabled value="DEFAULT">
                      Select one...
                    </option>
                    {Object.values(categories).map(item => (
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
              </>
            )}

            {category !== 'DEFAULT' && (
              <>
                <span
                  className="modal-link remove"
                  onClick={() => this.setDeleteMode('Category')}
                  onKeyPress={() => this.setDeleteMode('Category')}
                  role="button"
                  tabIndex={0}
                >
                  <FontAwesomeIcon icon={['fas', 'times']} />
                  <small>Remove Category</small>
                </span>

                <Form.Group controlId="input">
                  <Form.Label>Input</Form.Label>
                  <Form.Control
                    as="select"
                    name="input"
                    onChange={this.handleChange}
                    value={input}
                    required
                  >
                    <option disabled value="DEFAULT">
                      Select one...
                    </option>
                    {Object.values(inputs).map(item => (
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
              </>
            )}

            {input !== 'DEFAULT' && (
              <>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="E.g. Bread, Bus, Petrol Car"
                    name="name"
                    value={name}
                    onChange={this.handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="factor">
                  <Form.Label>Factor</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="E.g. 0.5"
                    name="factor"
                    step="0.01"
                    value={factor}
                    onChange={this.handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="unit">
                  <Form.Label>Unit</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="E.g. grams, KW/h, cycles per week"
                    name="unit"
                    value={unit}
                    onChange={this.handleChange}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  block
                  disabled={!isValid}
                >
                  Edit Input
                </Button>
                <Button
                  variant="danger"
                  size="lg"
                  block
                  onClick={() => this.setDeleteMode('Input')}
                  onKeyPress={() => this.setDeleteMode('Input')}
                >
                  Remove Input
                </Button>
              </>
            )}
            <Modal show={isOpen} onHide={this.closeModal}>
              <Form>
                <Modal.Header closeButton>
                  <Modal.Title>
                    Remove
                    {' '}
                    {deleteMode}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p className="text-muted no-top-margin">
                    Are you sure that you want to remove this
                    {' '}
                    {deleteMode.toLowerCase()}
                    ?
                  </p>
                  <p className="text-muted no-margins">
                    <strong>This action cannot be reversed.</strong>
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.closeModal}>
                    Close
                  </Button>
                  <Button
                    type="submit"
                    variant="danger"
                    onClick={this.handleDelete}
                  >
                    Remove
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
          </Form>
        </Container>
      </>
    );
  }
}

export default EditInput;
