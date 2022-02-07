import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Footer from './common/Footer';

const News = () => (
  <>
    <div>
      <main className="no-margins">
        <Row>
          <Col className="content" xs={9}>
            <Container fluid="md">
              {/** Edits permitted below this line */}
              <h3>News</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                placerat enim et sapien congue venenatis. Aenean viverra ex nec
                sapien condimentum, non blandit mi ullamcorper. Maecenas
                condimentum venenatis tempor. Nunc pulvinar metus eget dolor
                sollicitudin dictum. Duis sagittis suscipit fringilla. Integer
                rhoncus congue ante, in commodo diam. Sed rutrum, lacus in
                elementum faucibus, lorem justo placerat justo, iaculis commodo
                purus quam nec neque. Phasellus erat purus, placerat quis lectus
                ac, vehicula bibendum sapien. Integer sed metus varius, pulvinar
                mi ac, molestie sapien. Aenean a nulla in velit molestie auctor
                in at justo. Pellentesque rhoncus sapien at elit pellentesque,
                sit amet pharetra lorem interdum. Donec ut tellus neque. Duis
                euismod elit non nibh aliquam, id interdum felis pretium. Nunc
                vehicula faucibus tincidunt. Aliquam auctor enim ullamcorper
                erat luctus molestie.
              </p>
              <p>
                Pellentesque magna dolor, mollis eget sodales hendrerit, finibus
                non ipsum. Nulla cursus dictum risus, ut rhoncus tortor bibendum
                id. Nullam eleifend risus sit amet quam porttitor, non hendrerit
                ex semper. Praesent blandit diam ac sem tincidunt condimentum.
                Vivamus posuere nunc sit amet auctor ultrices. Nullam
                consectetur diam id cursus semper. Nulla eleifend euismod tellus
                vitae convallis. Duis nec lectus non ex bibendum porta at et
                tellus. Integer a leo urna. In hac habitasse platea dictumst.
                Nullam sed magna a quam cursus faucibus.
              </p>
              <p>
                Integer eget justo eu justo placerat aliquet at at lorem.
                Praesent suscipit tellus quis diam tincidunt varius. Integer
                iaculis dui eu quam maximus rutrum. Fusce sit amet nunc cursus,
                malesuada nulla vitae, facilisis ex. Pellentesque a nulla vel ex
                euismod rhoncus. Nullam consequat erat vitae diam pretium
                volutpat. Praesent dapibus erat a nibh aliquam laoreet. Donec
                vel tincidunt neque. Nulla sit amet felis ultricies, aliquam
                arcu a, gravida lacus. Integer in interdum metus.
              </p>
              {/** Edits permitted above this line */}
            </Container>
          </Col>
          <Col className="sidebar">
            {/** Edits permitted below this line */}
            <p>
              Integer neque nunc, pharetra eu massa at, ullamcorper rutrum
              turpis. Cras laoreet diam nec leo finibus, sed tempus nulla
              tempor. Vestibulum erat velit, finibus at ipsum vitae, tristique
              suscipit elit. In id felis a urna ornare imperdiet. Maecenas nibh
              neque, pharetra non velit sit amet, posuere ornare justo. Quisque
              convallis laoreet lorem id feugiat. Phasellus diam quam, dapibus
              vitae rutrum ac, hendrerit in diam. Nullam vel elementum elit.
              Aenean lacinia nisl vel faucibus iaculis. Nam et dolor tempor
              metus luctus pharetra pharetra eu sem.
            </p>
            {/** Edits permitted above this line */}
          </Col>
        </Row>
      </main>
    </div>
    <Footer />
  </>
);

export default News;
