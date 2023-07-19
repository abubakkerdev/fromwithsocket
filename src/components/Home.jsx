import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import UserTable from "./UserTable";
import UserFrom from "./UserFrom";
import { io } from "socket.io-client";

const socket = io("https://socketapi-y5iz.onrender.com");

function Home() {
  return (
    <div className="main-div-margin">
      <Container>
        <Row>
          <Col>
            <UserFrom socket={socket} />
          </Col>
          <Col>
            <UserTable socket={socket} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
