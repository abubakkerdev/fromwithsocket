import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import UserTable from "./UserTable";
import UserFrom from "./UserFrom";

function Home() {
  return (
    <div className="main-div-margin">
      <Container>
        <Row>
          <Col>
            <UserFrom />
          </Col>
          <Col>
            <UserTable />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
