import React from 'react';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import Social from './Social';

const Footer = () => (
  <div>
    <footer className="blue">
      <Container fluid>
        <Link to="/about">
          <h3>About Zero Carbon 2030</h3>
        </Link>
        <p>Lorem ipsum dolor sit amet.</p>
      </Container>
    </footer>
    <footer className="dark-green">
      <Container fluid>
        <h3>Our Partners</h3>
        <p>[Partner logos here]</p>
      </Container>
    </footer>
    <footer className="red smaller">
      <Container fluid>
        <Social />
      </Container>
    </footer>
  </div>
);

export default Footer;
