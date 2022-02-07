import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import Footer from './common/Footer';
import HowItWorks from './common/HowItWorks';
import Tape from './common/Tape';

const Home = () => (
  <>
    <div>
      <Carousel>
        <Carousel.Item
          style={{
            backgroundImage: 'url(/public/assets/carousel_large.jpg)',
          }}
        >
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>
              Nulla vitae elit libero, a pharetra augue mollis interdum.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item
          style={{ backgroundImage: 'url(/public/assets/carousel.jpg)' }}
        >
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item
          style={{ backgroundImage: 'url(/public/assets/carousel.jpg)' }}
        >
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl
              consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <main className="no-margins">
        <Row>
          <Col className="links" xs={9}>
            <Container fluid="md">
              <Row className="paper">
                <Link to="/resources" className="col variation-one">
                  <Tape />
                  <h3>Learning & Education Resources</h3>
                </Link>
                <Link to="/calculator" className="col variation-two">
                  <Tape />
                  <h3>Carbon Calculator</h3>
                </Link>
              </Row>
              <Row className="paper">
                <Link to="/buy-offset" className="col variation-one">
                  <Tape />
                  <h3>Buy Your Offset</h3>
                </Link>
                <Link to="/about" className="col variation-three">
                  <Tape />
                  <h3>Zero Carbon & Climate Change</h3>
                </Link>
              </Row>
              <Row className="paper">
                <Link to="/registry" className="col variation-two">
                  <Tape />
                  <h3>Carbon Registry for Wales</h3>
                </Link>
                <Link to="/projects" className="col variation-one">
                  <Tape />
                  <h3>Projects</h3>
                </Link>
              </Row>
            </Container>
          </Col>
          <Col className="sidebar">
            <HowItWorks />
          </Col>
        </Row>
      </main>
      <Footer />
    </div>
  </>
);

export default Home;
