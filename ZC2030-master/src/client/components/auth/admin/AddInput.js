import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import {
  Form, Button, Container, Alert
} from 'react-bootstrap';

library.add(faPlusSquare);

class AddInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: 'DEFAULT',
      name: '',
      factor: '',
      unit: '',
      categories: [],
      newName: '',
      types: [],
      type: 'DEFAULT',
      isOpen: false,
      mode: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleModalSubmit = this.handleModalSubmit.bind(this);
    this.setModalMode = this.setModalMode.bind(this);
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

  setModalMode(mode) {
    this.setState({
      mode,
    });
    this.openModal();
  }


  handleSubmit(event) {
    event.preventDefault();
    if (!event.target.checkValidity()) {
      return;
    }
    this.setState({ errorMessage: null });

    const {
      category, name, factor, unit
    } = this.state;

    fetch('/api/calc/new-input', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categoryId: category,
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
        this.setState({ successMessage: `${name} created successfully.` });
        this.setState({
          name: '',
          factor: '',
          unit: '',
        });
      })
      .catch((err) => {
        err.json().then((errorMessage) => {
          this.setState({ errorMessage: errorMessage.message });
        });
      });
  }

  handleModalSubmit(event) {
    event.preventDefault();
    if (!event.target.checkValidity()) {
      return;
    }
    this.setState({ errorMessage: null });

    const {
      newName, categories, types, type, mode
    } = this.state;

    // New category submitted
    if (mode === 'Category') {
      fetch('/api/calc/new-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
          type
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((data) => {
          // Create new object for category, and push it to the categories array
          const obj = {};
          obj.id = data.id;
          obj.name = newName;
          categories.push(obj);
          this.setState({
            newName: '',
            modalErrorMessage: '',
            category: data.id,
          });
          // Close the modal
          this.closeModal();
        })
        .catch((err) => {
          err.json().then((errorMessage) => {
            this.setState({ modalErrorMessage: errorMessage.message });
          });
        });
    }

    // New type submitted
    if (mode === 'Type') {
      // Clear categories
      this.setState({
        categories: [],
        category: 'DEFAULT'
      });

      fetch('/api/organisations/new-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((data) => {
          // Create new object for category, and push it to the categories array
          const obj = {};
          obj.id = data.id;
          obj.name = newName;
          types.push(obj);
          this.setState({
            newName: '',
            modalErrorMessage: '',
            type: data.id,
          });
          // Close the modal
          this.closeModal();
        })
        .catch((err) => {
          err.json().then((errorMessage) => {
            this.setState({ modalErrorMessage: errorMessage.message });
          });
        });
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });

    // When type is changed, update the categories
    if (name === 'type') {
      // Reset categories
      this.setState({
        categories: [],
        category: 'DEFAULT'
      });

      fetch('/api/calc/categories-from-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: value
        })
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
    }
  }

  render() {
    const {
      name,
      factor,
      unit,
      category,
      errorMessage,
      successMessage,
      categories,
      isOpen,
      redirect,
      type,
      types,
      mode,
      newName,
      modalErrorMessage
    } = this.state;
    const isValid = category !== 'DEFAULT'
      && type !== 'DEFAULT'
      && name.length > 0
      && factor.length > 0
      && unit.length > 0;

    let isModalValid = false;

    if (mode === 'Category' && newName.length > 0 && type !== 'DEFAULT') {
      isModalValid = true;
    }

    if (mode === 'Type' && newName.length > 0) {
      isModalValid = true;
    }

    if (redirect) {
      return <Redirect to="/admin-login" />;
    }

    return (
      <>
        <Container className="mt-5 smaller">
          <h3>Add Input</h3>
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

            <span
              className="modal-link"
              onClick={() => this.setModalMode('Type')}
              onKeyPress={() => this.setModalMode('Type')}
              role="button"
              tabIndex={0}
            >
              <FontAwesomeIcon icon={['fas', 'plus-square']} />
              <small>Add Type</small>
            </span>

            {type !== 'DEFAULT' && (
              <>
                {/* <span
                  className="modal-link remove"
                  onClick={() => this.setDeleteMode('Type')}
                  onKeyPress={() => this.setDeleteMode('Type')}
                  role="button"
                  tabIndex={0}
                >
                  <FontAwesomeIcon icon={['fas', 'times']} />
                  <small>Remove Type</small>
                </span> */}

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
                <span
                  className="modal-link"
                  onClick={() => this.setModalMode('Category')}
                  onKeyPress={() => this.setModalMode('Category')}
                  role="button"
                  tabIndex={0}
                >
                  <FontAwesomeIcon icon={['fas', 'plus-square']} />
                  <small>Add Category</small>
                </span>

              </>
            )}

            <Modal show={isOpen} onHide={this.closeModal}>
              <Form>
                <Modal.Header closeButton>
                  <Modal.Title>
                    Add
                    {` ${mode}`}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {modalErrorMessage && <Alert variant="danger">{modalErrorMessage}</Alert>}
                  <Form.Group controlId="newName">
                    <Form.Label>
                      {mode}
                      {' '}
                      Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={mode === 'Category' ? (
                        'E.g. Food, Transport, Energy'
                      ) : (
                        'E.g. School, Business, Community'
                      )}
                      name="newName"
                      value={newName}
                      onChange={this.handleChange}
                      required
                      autoFocus
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.closeModal}>
                    Close
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    onClick={this.handleModalSubmit}
                    disabled={!isModalValid}
                  >
                    Add
                    {` ${mode}`}
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>

            {type !== 'DEFAULT' && category !== 'DEFAULT' && (
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
                disabled={!isValid}
                block
              >
                Add Input
              </Button>
            </>
            )}
          </Form>
        </Container>
      </>
    );
  }
}

export default AddInput;
