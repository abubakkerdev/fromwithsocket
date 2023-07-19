import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { insertData } from "../slice/userSlice";

function UserTable({ socket }) {
  const [alluser, setAllUser] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("connected", (message) => {
      console.log(message);
    });

    socket.on("allUser", (data) => {
      if (Array.isArray(data)) {
        setAllUser(data);
      }
    });

    socket.on("deleteUser", (id) => {
      if (typeof id == "string") {
        setAllUser((prevItems) => prevItems.filter((item) => item._id !== id));
      }
    });

    socket.on("storeUser", (newItem) => {
      if (!Array.isArray(newItem)) {
        setAllUser((prevItems) => [...prevItems, newItem]);
      }
    });

    socket.on("updateUser", (data) => {
      if (!Array.isArray(data)) {
        setAllUser((prevItems) =>
          prevItems.map((item) => (item._id === data._id ? data : item))
        );
      }
    });

    socket.emit("userList");

    return () => {
      socket.off("connected");
      socket.off("userList");
      socket.off("allUser");
      socket.off("storeUser");
      socket.off("updateUser");
      socket.off("deleteUser");
    };
  }, []);

  const handleDelete = (id) => {
    if (id) {
      socket.emit("userDelete", id);
    }
  };

  const handleEdit = (id) => {
    let userId = alluser.findIndex((user) => user._id === id);

    if (userId >= 0) {
      dispatch(insertData(alluser[userId]));
    }
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
            <td colSpan={6} className="errorText">
              There have no value.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default UserTable;
