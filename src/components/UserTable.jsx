import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { insertData } from "../slice/userSlice";
import { io } from "socket.io-client";

function UserTable() {
  const [alluser, setAllUser] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const webSocket = io("http://localhost:1010");

    webSocket.emit("userList", "demo");
    webSocket.on("allUser", (data) => {
      if (Array.isArray(data)) {
        setAllUser(() => [...data]);
      }
    });
  }, []);

  const handleDelete = (id) => {
    const webSocket = io("http://localhost:1010");

    webSocket.emit("userDelete", id);
    webSocket.on("deleteUser", (data) => {
      if (data === "success") {
        webSocket.emit("userList", "demo");
      }
    });
  };

  const handleEdit = (id) => {
    const webSocket = io("http://localhost:1010");

    webSocket.emit("userEdit", id);
    webSocket.on("editUser", (data) => {
      if ("email" in data) {
        dispatch(insertData({ ...data }));
      }
    });
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Password</th>
          <th>Country</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {alluser.length > 0 ? (
          alluser.map((val, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{val.uname}</td>
              <td>{val.email}</td>
              <td>{val.password}</td>
              <td>{val.country}</td>
              <td>
                <ButtonGroup size="sm">
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleEdit(val._id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleDelete(val._id);
                    }}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td>1</td>
            <td colSpan={5}>There was no value.</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default UserTable;
