import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Adduser = () => {
  const navigate = useNavigate();
  // State variables for user form and users list
  const [GetRoles, setGetRoles] = useState([]);
  const [UserName, setUserName] = useState("");
  const [UserEmail, setUserEmail] = useState("");
  const [UserPassword, setUserPassword] = useState("");
  const [UserRole, setUserRole] = useState("none");
  const [UserImage, setUserImage] = useState("");
  const [Error, setError] = useState("");
  const [Success, setSuccess] = useState("");
  const [Users, setUsers] = useState([]);
  const [SelectedUser, setSelectedUser] = useState(null);

  // Fetch roles from the server
  useEffect(() => {
    async function getRoles() {
      try {
        const getRoles_Response = await fetch("http://localhost:5000/role");

        if (getRoles_Response.ok) {
          const response = await getRoles_Response.json();
          // Set the roles if 'data' exists
          setGetRoles(Array.isArray(response.data) ? response.data : []);
        } else {
          console.error("Failed to fetch roles:", getRoles_Response.status);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    }

    async function getUsers() {
      try {
        const response = await fetch("http://localhost:5000/user");
        if (response.ok) {
          const data = await response.json();
          console.log(data); // Log the full response to see its structure
          if (Array.isArray(data.data)) {
            // Access the data inside the "data" field
            setUsers(data.data); // Correctly set the users array
          } else {
            console.error(
              "Response does not contain an array in 'data':",
              data
            );
          }
        } else {
          console.error("Failed to fetch users:", response.status);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    getRoles();
    getUsers();
  }, []);
  // Handle form submit (Add User)
 const handleSubmit = async (e) => {
   e.preventDefault();

   // Validate form fields
   if (
     UserName === "" ||
     UserEmail === "" ||
     UserRole === "none" ||
     UserPassword === "" ||
     UserImage === ""
   ) {
     alert("Please fill in all the fields!");
   } else {
     const newUser = {
       userName: UserName,
       userEmail: UserEmail,
       userImage: UserImage,
       userPassword: UserPassword,
       userRole: UserRole,
     };

     console.log("New User Data:", newUser); // Debugging the user data

     try {
       const response = await fetch("http://localhost:5000/user", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(newUser),
       });

       // Log the response status and body for better debugging
       console.log("Response Status:", response.status);
       console.log("Response Body:", await response.text());

       if (response.status === 201) {
         alert("User successfully added!");
         // Reset the form fields after successful submission
         setUserName("");
         setUserEmail("");
         setUserPassword("");
         setUserImage("");
         setUserRole("none");
       } else if (response.status === 400) {
         alert("Bad request: Please check the form data.");
       } else if (response.status === 500) {
         alert("Server error: Please try again later.");
       } else {
         alert("Something went wrong! Please try again.");
       }
     } catch (error) {
       console.error("Error while submitting the form:", error);
       alert("An error occurred, please try again later.");
     }
   }
 };


  // Handle delete user
 const deleteUser = async (id) => {
   try {
     // Use _id instead of id to match MongoDB format
     const response = await fetch(`http://localhost:5000/user/${id}`, {
       method: "DELETE",
     });

     if (response.status === 200) {
       alert("User deleted successfully!");
       // Remove the user from the state after successful deletion
       setUsers(Users.filter((user) => user._id !== id)); // Use _id for consistency
     } else {
       alert("Something went wrong! Please try again.");
     }
   } catch (error) {
     console.error("Error while deleting user:", error);
     alert("An error occurred, please try again later.");
   }
 };

  // Handle open edit modal
  const openEditModal = (user) => {
    console.log("Selected User for Edit: ", user); // Log the selected user to check
    setSelectedUser(user);
    setUserName(user.userName);
    setUserEmail(user.userEmail);
    setUserRole(user.userRole);
    setUserImage(user.userImage);
  };

  // Handle update user
  const updateUser = async (e) => {
    e.preventDefault();

    if (!SelectedUser || !SelectedUser._id) {
      console.error("User ID is missing");
      return;
    }

    const updatedUser = {
      userName: UserName,
      userEmail: UserEmail,
      userimage: UserImage,
      userPassword: UserPassword,
      UserRole: UserRole,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/user/${SelectedUser._id}`, // Use the correct URL// Use the correct URL
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (response.status === 200) {
        alert("User updated successfully!");
        setSelectedUser(null);
        setUserName("");
        setUserEmail("");
        setUserPassword("");
        setUserImage("");
        setUserRole("none");
      } else {
        const result = await response.json();
        alert(result.error || "Failed to update user.");
      }
    } catch (error) {
      console.error("Error while updating user:", error);
      alert("An error occurred, please try again later.");
    }
  };

  console.log("SelectedUser:", SelectedUser);
  if (!SelectedUser || !SelectedUser._id) {
    console.error("Invalid SelectedUser:", SelectedUser);
  }

  return (
    <>
      <div style={{ marginTop: "5%" }} className="mt-5">
        <div className="container shadow-lg col-6">
          <h1 className="text-center p-4" style={{ color: "#011b33" }}>
            <b>
              <u> Add User </u>
            </b>
          </h1>
          {Error && (
            <div className="alert alert-danger" role="alert">
              <p>{Error}</p>
            </div>
          )}
          {Success && (
            <div className="alert alert-success" role="alert">
              <p>{Success}</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                User Name
              </label>
              <input
                type="text"
                className="form-control"
                name="userName"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                User Email
              </label>
              <input
                type="email"
                className="form-control"
                name="userEmail"
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                User Password
              </label>
              <input
                type="password"
                className="form-control"
                name="userPassword"
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputImage1" className="form-label">
                User Image URL
              </label>
              <input
                type="text"
                className="form-control"
                name="userImage"
                onChange={(e) => setUserImage(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="form3Example4cdg">
                Role
              </label>
              <select
                className="form-control"
                value={UserRole}
                onChange={(e) => setUserRole(e.target.value)}
              >
                <option value="none">Choose Role</option>
                {Array.isArray(GetRoles) && GetRoles.length > 0 ? (
                  GetRoles.map((userRole, index) => (
                    <option key={index} value={userRole.Role}>
                      {userRole.Role}
                    </option>
                  ))
                ) : (
                  <option>No roles available</option>
                )}
              </select>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-sm mb-3"
                style={{ backgroundColor: "#023564", color: "white" }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* //------------------------------- show */}
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
                User Name
              </th>
              <th
                style={{ backgroundColor: "#021931", color: "white" }}
                scope="col"
              >
                User Email
              </th>
              
              <th
                style={{ backgroundColor: "#021931", color: "white" }}
                scope="col"
              >
                User Image
              </th>
              <th
                style={{ backgroundColor: "#021931", color: "white" }}
                scope="col"
              >
                User Role
              </th>
              <th
                style={{ backgroundColor: "#021931", color: "white" }}
                scope="col"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(Users) && Users.length > 0 ? (
              Users.map((user) => (
                <tr key={user.id}>
                  <td>{user.userName}</td>
                  <td>{user.userEmail}</td>
                  <td>{user.userimage}</td>
                  <td>{user.UserRole}</td>
                  <td>
                    <button
                      className="btn btn-dark btn-sm mx-2"
                      onClick={() => openEditModal(user)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No users found.</td>
              </tr>
            )}
          </tbody>
          {/* Log the Users state before rendering */}
          {console.log(Users)} {/* Debugging the state */}
        </table>
      </div>
      {/* Modal for Update */}
      {SelectedUser && (
        <div
          className="modal show"
          style={{ display: "block", position: "fixed", top: "0", left: "0" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update User</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => {
                    setSelectedUser(null);
                    setUserName("");
                    setUserEmail("");
                    setUserPassword("");
                    setUserImage("");
                    setUserRole("none");
                  }}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={updateUser}>
                  <div className="mb-3">
                    <label htmlFor="editUserName" className="form-label">
                      User Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="editUserName"
                      value={UserName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editUserEmail" className="form-label">
                      User Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="editUserEmail"
                      value={UserEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editUserPassword" className="form-label">
                      User Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="editUserPassword"
                      value={UserPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editUserImage" className="form-label">
                      User Image URL
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="editUserImage"
                      value={UserImage}
                      onChange={(e) => setUserImage(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editUserRole" className="form-label">
                      Role
                    </label>
                    <select
                      className="form-control"
                      id="editUserRole"
                      value={UserRole}
                      onChange={(e) => setUserRole(e.target.value)}
                    >
                      <option value="none">Choose Role</option>
                      {Array.isArray(GetRoles) && GetRoles.length > 0 ? (
                        GetRoles.map((role, index) => (
                          <option key={index} value={role.Role}>
                            {role.Role}
                          </option>
                        ))
                      ) : (
                        <option>No roles available</option>
                      )}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ marginTop: "10px" }}
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Adduser;
