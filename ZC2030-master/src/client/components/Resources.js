import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import {
  Link
} from 'react-router-dom';
import Footer from './common/Footer';
import Tape from './common/Tape';

const Resources = () => (
  <>
    <div>
      <main className="no-margins">
        <Row>
          <Col className="links" xs={9}>
            <Container fluid="md">
              <Row className="paper">
                <Link to="/example" className="col variation-one">
                  <Tape />
                  <h3>Link 1</h3>
                </Link>
                <Link to="/example" className="col variation-two">
                  <Tape />
                  <h3>Link 2</h3>
                </Link>
              </Row>
              <Row className="paper">
                <Link to="/example" className="col variation-one">
                  <Tape />
                  <h3>Link 3</h3>
                </Link>
                <Link to="/example" className="col variation-three">
                  <Tape />
                  <h3>Link 4</h3>
                </Link>
              </Row>
              <Row className="paper">
                <Link to="/example" className="col variation-two">
                  <Tape />
                  <h3>Link 5</h3>
                </Link>
                <Link to="/example" className="col variation-one">
                  <Tape />
                  <h3>Link 6</h3>
                </Link>
              </Row>
              <Row className="paper">
                <Link to="/example" className="col variation-two">
                  <Tape />
                  <h3>Link 7</h3>
                </Link>
                <Link to="/example" className="col variation-one">
                  <Tape />
                  <h3>Link 8</h3>
                </Link>
              </Row>
              <Row className="paper">
                <Link to="/example" className="col variation-two">
                  <Tape />
                  <h3>Link 9</h3>
                </Link>
                <Link to="/example" className="col variation-one">
                  <Tape />
                  <h3>Link 10</h3>
                </Link>
              </Row>
            </Container>
          </Col>
          <Col className="sidebar">
            {/** Edits permitted below this line */}
            <h3>Overview</h3>
            <br />
            <p>This is the overview of the ZC2030 project</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse fermentum ac metus sit amet volutpat. Phasellus non
              velit vitae diam maximus efficitur. Aenean ut pharetra turpis, in
              congue enim. Vestibulum mi elit, fringilla id leo ut, vehicula
              aliquam leo. Suspendisse potenti. Aenean sit amet erat eget ligula
              feugiat malesuada vel dapibus diam. In blandit enim ac egestas
              dictum. Praesent sit amet eros viverra, maximus urna tristique,
              posuere metus. Donec egestas mauris felis. Nullam mattis aliquet
              nisl, eu vehicula leo lobortis quis. Quisque quis odio libero. Ut
              tempus massa at orci dignissim gravida. Donec ac gravida felis,
              vel aliquam turpis. Sed aliquet libero sit amet semper egestas.
            </p>
            <p>
              Cras odio leo, ornare eget lectus et, varius consequat tortor.
              Aliquam at diam pulvinar erat efficitur lacinia nec ut quam. Sed
              viverra massa sit amet sapien ullamcorper, a pellentesque nulla
              vestibulum. Suspendisse fermentum iaculis condimentum. Sed justo
              sem, fermentum non felis ac, mollis egestas nunc. Sed risus dolor,
              efficitur id turpis nec, egestas condimentum diam. Morbi metus
              odio, aliquet vitae massa et, dictum cursus lorem. Phasellus
              sollicitudin lacus id dolor iaculis iaculis. Sed rutrum lectus ac
              fringilla luctus. Aenean in massa lacus. Phasellus lacinia tempor
              ex, ac rhoncus lectus fermentum et. In hac habitasse platea
              dictumst. Nunc vitae lacinia ligula, quis luctus erat. In hac
              habitasse platea dictumst.
            </p>
            {/** Edits permitted above this line */}
          </Col>
        </Row>
      </main>
    </div>
    <Footer />
  </>
);

export default Resources;
