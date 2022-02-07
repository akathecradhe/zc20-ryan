import React from 'react';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { slide as Menu } from 'react-burger-menu';
import Cookies from 'universal-cookie';
import Social from './Social';

const cookies = new Cookies();

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      organisationName: '',
      type: '',
      myTotal: '',
      groupTotal: '',
      orgTotal: '',
      canManage: false,
      loggedIn: false
    };
  }

  componentDidMount() {
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
        if (data.type) {
          this.setState({ type: data.type });
          this.setState({ loggedIn: true });
        }

        if (data.type === 'participant') {
          this.setState({ organisationName: data.organisationName });
        }

        if (data.type === 'trainer') {
          this.setState({ organisationName: data.organisationName });
          this.setState({ canManage: data.canManage });
        }

        if (data.type === 'participant') {
          fetch('/api/calc/totals', {
            method: 'GET'
          })
            .then((response) => {
              if (!response.ok) {
                throw response;
              }
              return response.json();
            })
            .then((response) => {
              this.setState({
                myTotal: response.myTotal,
                groupTotal: response.groupTotal,
                orgTotal: response.orgTotal
              });
            })
            .catch((err) => {
              console.error(err);
            });
        }

        // For faster loading
        if (data.organisationTypeName) {
          cookies.set('type', data.organisationTypeName, { path: '/' });
        } else {
          cookies.set('type', 'Individual', { path: '/' });
        }
      })
      .catch(() => {
        // console.error(err);
      });
  }

  render() {
    const {
      loggedIn, type, organisationName, canManage, myTotal, groupTotal, orgTotal
    } = this.state;
    return (
      <>
        <Navbar bg="dark" variant="dark" className="green">
          <Container fluid>
            <Navbar.Brand href="/">ZC2030</Navbar.Brand>
            <Nav className="ml-auto desktop">
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="/resources">Resources</Nav.Link>
              <Nav.Link href="/news">News</Nav.Link>
              <Nav.Link href="/registry">Carbon Registry</Nav.Link>
            </Nav>
            <Menu right>
              <br />
              <ListGroup className="mobile">
                <ListGroup.Item>
                  <a href="/about">About</a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <a href="/resources">Resources</a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <a href="/news">News</a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <a href="/registry">Carbon Registry</a>
                </ListGroup.Item>
              </ListGroup>
              {!loggedIn && (
                <>
                  <a href="/login">
                    <Button variant="success" size="lg" block>
                      Log In
                    </Button>
                  </a>
                  <a href="/signup">
                    <Button variant="primary" size="lg" block>
                      Sign Up
                    </Button>
                  </a>
                  <p className="grey mt-3">
                    <small>
                      Sign up to link your account with an organisation and save
                      your results from the carbon calculators.
                    </small>
                  </p>
                  <hr />
                  <p className="grey mt-4">
                    <small>
                      <a href="/join">Organisation Sign Up</a>
                      <br />
                      <a href="/trainer-login">Trainer Log In</a>
                    </small>
                  </p>
                  <hr />
                  <p className="grey mt-4">
                    <small>
                      <a href="/admin-login">Admin Log In</a>
                    </small>
                  </p>
                </>
              )}
              {loggedIn && (
                <>
                  {myTotal > 0 && type === 'participant' && (
                    <p>
                      Me:
                      <strong>
                        {' '}
                        {myTotal.toFixed(2)}
                      </strong>
                      <span className="unit">kg CO2e</span>
                    </p>
                  )}
                  {groupTotal > 0 && type === 'participant' && (
                    <p>
                      Group:
                      <strong>
                        {' '}
                        {groupTotal.toFixed(2)}
                      </strong>
                      <span className="unit">kg CO2e</span>
                    </p>
                  )}
                  {orgTotal > 0 && type === 'participant' && (
                    <p>
                      Organisation:
                      <strong>
                        {' '}
                        {orgTotal.toFixed(2)}
                      </strong>
                      <span className="unit">kg CO2e</span>
                    </p>
                  )}
                  {type === 'participant'
                    && (orgTotal > 0 || groupTotal > 0 || myTotal > 0) && (
                      <>
                        <hr className="equal" />
                      </>
                  )}
                  {organisationName && type === 'participant' && (
                    <p>
                      Your account is linked with
                      <strong>
                        {' '}
                        {organisationName}
                      </strong>
                      .
                    </p>
                  )}
                  {(!organisationName || organisationName === '')
                    && type === 'participant' && (
                      <a href="/link">
                        <Button variant="primary" size="lg" block>
                          Link Account
                        </Button>
                      </a>
                  )}
                  {type === 'participant' && (
                    <a href="/logs">
                      <Button variant="primary" size="lg" block>
                        View Logs
                      </Button>
                    </a>
                  )}
                  {type === 'admin' && (
                    <>
                      <a href="/add-input">
                        <Button variant="primary" size="lg" block>
                          Add Input
                        </Button>
                      </a>
                      <a href="/edit-input">
                        <Button variant="primary" size="lg" block>
                          Edit Input
                        </Button>
                      </a>
                      <a href="/create-admin">
                        <Button variant="primary" size="lg" block>
                          Create Admin
                        </Button>
                      </a>
                    </>
                  )}
                  {type === 'trainer' && (
                    <a href="/generate">
                      <Button variant="primary" size="lg" block>
                        Generate Passphrase
                      </Button>
                    </a>
                  )}
                  {type === 'trainer' && canManage && (
                    <a href="/create-trainer">
                      <Button variant="primary" size="lg" block>
                        Create Trainer
                      </Button>
                    </a>
                  )}
                  <p className="grey">
                    <small>
                      <a href="/logout">Logout</a>
                    </small>
                  </p>
                </>
              )}
              <hr />
              <Social />
            </Menu>
          </Container>
        </Navbar>
      </>
    );
  }
}
