import React from 'react';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Footer from './common/Footer';

const Registry = () => (
  <>
    <div>
      <main className="no-margins">
        <Row>
          <Col className="content" xs={12}>
            <Container fluid="md">
              {/** Edits permitted below this line */}
              <h3>Page Not Found</h3>
              <p>
                <strong>Unfortunately, this page doesn&apos;t exist.</strong>
                {' '}
                Please try heading back to the
                {' '}
                <Link to="/">homepage</Link>
                {' '}
                or
                use the menu (at the top of the page) to find what you&apos;re
                looking for.
              </p>
              {/** Edits permitted above this line */}
            </Container>
          </Col>
        </Row>
      </main>
    </div>
    <Footer />
  </>
);

export default Registry;
