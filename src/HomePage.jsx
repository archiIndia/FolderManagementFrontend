import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

const HomePage = () => {
  return (
    <Container className="text-center mt-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={6} md={4}>
          <Link to={'/signup'}>
            <Button variant="primary" size="lg" block>
              SignUp
            </Button>
          </Link>
        </Col>
      </Row>
      <br />
      <br />
      <br />
      <Row className="justify-content-center">
        <Col xs={12} sm={6} md={4}>
          <Link to={'/login'}>
            <Button variant="success" size="lg" block>
              LogIn
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
