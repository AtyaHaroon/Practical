import React from "react";

const UserList = () => {
  return (
    <>
      <div className="container mt-5">
        <h1 className="text-center mt-3" style={{ color: "#021931" }}>
          <b>
            <u>User List</u>
          </b>
        </h1>
        <table className="table mt-5">
          <thead>
            <tr>
              <th
                style={{ backgroundColor: "#021931", color: "white" }}
                scope="col"
              >
                #
              </th>
              <th
                style={{ backgroundColor: "#021931", color: "white" }}
                scope="col"
              >
                Student Name
              </th>
              <th
                style={{ backgroundColor: "#021931", color: "white" }}
                scope="col"
              >
                Student Email
              </th>
              <th
                style={{ backgroundColor: "#021931", color: "white" }}
                scope="col"
              >
                Student Course
              </th>
              <th
                style={{ backgroundColor: "#021931", color: "white" }}
                scope="col"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </>
  );
};

export default UserList;
