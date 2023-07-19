import React, { useState, useReducer, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useSelector } from "react-redux";

const initialState = {
  uname: "",
  email: "",
  password: "",
  country: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "inputHandler": {
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    }
    case "inputEmptyHandler": {
      return {
        ...initialState,
      };
    }
    case "inputUpdateHandler": {
      return {
        ...action.payload,
      };
    }
    default:
      return state;
  }
};

function UserFrom({ socket }) {
  const userInfo = useSelector((state) => state.user.value);
  const [state, inputDispatch] = useReducer(reducer, initialState);

  const options = [
    { value: "", text: "Choose your country" },
    { value: "Australia", text: "Australia" },
    { value: "Bangladesh", text: "Bangladesh" },
    { value: "Colombia", text: "Colombia" },
    { value: "Denmark", text: "Denmark" },
    { value: "Spain", text: "Spain" },
    { value: "Germany", text: "Germany" },
  ];
  const [selected, setSelected] = useState(options[0].value);
  const [error, setError] = useState({});

  const handleSubmit = () => {
    socket.emit("userCreate", { ...state });

    socket.on("storeUser", (data) => {
      if (Array.isArray(data)) {
        setError(data[0]);
      } else {
        setError({});
        inputDispatch({
          type: "inputEmptyHandler",
        });
        setSelected("");
      }
    });
  };

  const handleInputChange = (e) => {
    inputDispatch({
      type: "inputHandler",
      payload: {
        name: e.target.name,
        value: e.target.value,
      },
    });
    setSelected(e.target.value);
  };

  const handleUpdate = () => {
    socket.emit("userUpdate", { ...state });

    socket.on("updateUser", (data) => {
      if (Array.isArray(data)) {
        setError(data[0]);
      } else {
        setError({});
        inputDispatch({
          type: "inputEmptyHandler",
        });
        setSelected("");
      }
    });
  };

  useEffect(() => {
    inputDispatch({
      type: "inputUpdateHandler",
      payload: {
        ...userInfo,
      },
    });
  }, [userInfo]);

  return (
    <Card>
      <Card.Header>User From</Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="your name"
                onChange={handleInputChange}
                name="uname"
                value={state.uname}
              />
              {error && error.uname ? (
                <Alert variant="danger">{error.uname}</Alert>
              ) : (
                ""
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                onChange={handleInputChange}
                name="email"
                value={state.email}
              />
              {error && error.email ? (
                <Alert variant="danger">{error.email}</Alert>
              ) : error && error.emailValid ? (
                <Alert variant="danger">{error.emailValid}</Alert>
              ) : (
                ""
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="v$2.B@*1"
                onChange={handleInputChange}
                name="password"
                value={state.password}
              />
              {error && error.password ? (
                <Alert variant="danger">{error.password}</Alert>
              ) : (
                ""
              )}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>

              <Form.Select
                onChange={handleInputChange}
                value={state.country}
                name="country"
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </Form.Select>
              {error && error.country ? (
                <Alert variant="danger">{error.country}</Alert>
              ) : (
                ""
              )}
            </Form.Group>
          </Col>
        </Row>
        {"email" in userInfo ? (
          <Button
            as="input"
            type="submit"
            onClick={handleUpdate}
            value="Update"
          />
        ) : (
          <Button
            as="input"
            type="submit"
            onClick={handleSubmit}
            value="Submit"
          />
        )}
      </Card.Body>
    </Card>
  );
}

export default UserFrom;
