import React, { useEffect, useState } from "react";

const Userdata = () => {
  const [GetRoles, setGetRoles] = useState([]);
  const [UserName, setUserName] = useState("");
  const [UserEmail, setUserEmail] = useState("");
  const [UserPassword, setUserPassword] = useState("");
  const [UserRole, setUserRole] = useState("none");
  const [UserImage, setUserImage] = useState(null); // Store file object
  const [IMG, setIMG] = useState(""); // Store the image URL for preview
  const [Error, setError] = useState("");
  const [Success, setSuccess] = useState("");
  const [Users, setUsers] = useState([]);
  const [SelectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch roles from the server
  useEffect(() => {
    async function getRoles() {
      try {
        const getRoles_Response = await fetch("http://localhost:5000/role");

        if (getRoles_Response.ok) {
          const response = await getRoles_Response.json();
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
          console.log("Fetched users:", data); // Log the fetched data

          // Check if the response contains a `data` field that is an array
          if (Array.isArray(data.data)) {
            // Successfully received a list of users, set them to the state
            setUsers(data.data);
          } else {
            console.error(
              "Unexpected response structure, 'data' field not found:",
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

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImage(file);
      setIMG(URL.createObjectURL(file)); // Create a preview URL for the image
    }
  };
  // ---------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim the email to remove any leading/trailing spaces
    const trimmedEmail = UserEmail.trim();

    if (
      UserName === "" ||
      trimmedEmail === "" ||
      UserRole === "none" ||
      UserPassword === "" ||
      !UserImage
    ) {
      alert("Please fill in all the fields!");
      return;
    }

    const formData = new FormData();
    formData.append("userName", UserName);
    formData.append("userEmail", trimmedEmail); // Use the trimmed email
    formData.append("userPassword", UserPassword);
    formData.append("userRole", UserRole);
    formData.append("userImage", UserImage);

    try {
      const response = await fetch("http://localhost:5000/user", {
        method: "POST",
        body: formData,
      });

      const responseBody = await response.text();
      console.log("Response Status:", response.status);
      console.log("Response Body:", responseBody);

      if (response.status === 201) {
        alert("User successfully added!");
        setSuccess("User successfully added!");
        setUserName("");
        setUserEmail("");
        setUserPassword("");
        setUserImage(null);
        setIMG("");
        setUserRole("none");
      } else if (response.status === 400) {
        setError("Bad request: Please check the form data.");
        // alert("Bad request: Please check the form data.");
      } else if (response.status === 500) {
        setError("Server error: Please try again later.");
        // alert("Server error: Please try again later.");
      } else {
        setError("Something went wrong! Please try again.");
        // alert("Something went wrong! Please try again.");
      }
    } catch (error) {
      console.error("Error while submitting the form:", error);
      setError("An error occurred, please try again later.");
      // alert("An error occurred, please try again later.");
    }
  };
  // --------------------- delete

  // Handle user deletion
  // // Handle user deletion
  const deleteUser = async (userName) => {
    try {
      const response = await fetch(`http://localhost:5000/user/${userName}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message); // Message from backend
        setUsers(Users.filter((user) => user.userName !== userName)); // Corrected: use 'Users' to filter
      } else {
        setError(data.error || "Failed to delete the user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Error deleting user.");
    }
  };

  //update
  // Handle image file change for modal
  const handleImageChangeForModal = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImage(file);
      setIMG(URL.createObjectURL(file)); // Create a preview URL for the image
    }
  };

  // Handle user update (form submission)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = UserEmail.trim();

    if (
      UserName === "" ||
      trimmedEmail === "" ||
      UserRole === "none" ||
      UserPassword === ""
    ) {
      alert("Please fill in all the fields!");
      return;
    }

    const formData = new FormData();
    formData.append("userName", UserName);
    formData.append("userEmail", trimmedEmail);
    formData.append("userPassword", UserPassword);
    formData.append("userRole", UserRole);
    formData.append("userImage", UserImage);

    try {
      const response = await fetch(`http://localhost:5000/user/${UserName}`, {
        method: "PUT",
        body: formData,
      });

      const responseBody = await response.json();
      console.log("Response Status:", response.status);
      console.log("Response Body:", responseBody);

      if (response.status === 200) {
        alert("User successfully updated!");
        setSuccess("User successfully updated!");
        setIsModalOpen(false); // Close modal
        setUserName("");
        setUserEmail("");
        setUserPassword("");
        setUserRole("none");
        setUserImage(null);
        setIMG("");
        setUsers(
          Users.map((user) =>
            user.userName === UserName
              ? {
                  ...user,
                  userEmail: trimmedEmail,
                  userRole: UserRole,
                  userImage: IMG,
                }
              : user
          )
        );
      } else {
        setError(responseBody.error || "Failed to update user.");
      }
    } catch (error) {
      console.error("Error while submitting the form:", error);
      setError("An error occurred, please try again later.");
    }
  };

  // Open the update modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setUserName(user.userName);
    setUserEmail(user.userEmail);
    setUserPassword(user.userPassword); // Optional: Clear password field for security
    setUserRole(user.userRole);
    setIMG(user.userImage || "");
    setIsModalOpen(true);
  };

  // Close the update modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <hr />
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
              <label htmlFor="userName" className="form-label">
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
              <label htmlFor="userEmail" className="form-label">
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
              <label htmlFor="userPassword" className="form-label">
                User Password
              </label>
              <input
                type="password"
                className="form-control"
                name="userPassword"
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </div>

            <div className="row mb-3 mt-2">
              <div className="col-9">
                <label htmlFor="userImage" className="form-label">
                  Image
                </label>
                <input
                  name="userImage"
                  onChange={handleImageChange}
                  type="file"
                  className="form-control"
                  id="userImage"
                />
              </div>
              <div className="col-3">
                {IMG === "" ? (
                  <div
                    style={{
                      backgroundColor: "#98939378",
                      width: "100px",
                      height: "100px",
                      color: "grey",
                      fontSize: "13px",
                    }}
                    className="px-3 py-4 text-center"
                  >
                    No Image selected
                  </div>
                ) : (
                  <img
                    style={{ maxWidth: "120px" }}
                    alt="Selected"
                    className="img-thumbnail"
                    src={IMG}
                  />
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="userRole">
                Role
              </label>
              <select
                className="form-control"
                name="userRole"
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
                className="btn btn-md mb-3"
                style={{ backgroundColor: "#023564", color: "white" }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <br />
      <hr />
      <hr />
      {/* ///----------------------------------------------- */}
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
                className="text-center"
                colspan="2"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(Users) && Users.length > 0 ? (
              Users.map((user) => (
                <tr key={user.id}>
                  <td className="text-capitalize">{user.userName}</td>
                  <td className="text-capitalize">{user.userEmail}</td>
                  <td>
                    {user.userImage ? (
                      <img
                        src={user.userImage} // You can display an image if available
                        alt="User"
                        style={{ maxWidth: "50px", maxHeight: "50px" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="text-capitalize">{user.userRole}</td>
                  <td >
                    <button
                      className="btn btn-warning float-end btn-sm mx-2"
                      onClick={() => openEditModal(user)}
                    >
                      Update
                    </button>
                  </td>
                  
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteUser(user.userName)} // Deleting by userName
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
        </table>
      </div>

      <br />
      <hr />
      <br />

      {/* //--------------------------------------- */}

      {/* Update Modal */}
      {isModalOpen && (
        <div
          className="modal show"
          style={{ display: "block" }}
          onClick={closeModal}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: "#023564", color: "white" }}
              >
                <div className="col-11 text-center">
                  <h3 className="modal-title">
                    <b>
                      <u>Update User</u>
                    </b>
                  </h3>
                </div>
                <div className="col-1">
                  <button
                    type="button"
                    className="close modal-close-btn"
                    onClick={closeModal}
                    style={{
                      backgroundColor: "transparent", // Transparent background to fit modal
                      border: "none", // No border
                      position: "absolute", // Absolute positioning to float it on the top right
                      top: "10px", // Distance from the top
                      right: "10px", // Distance from the right
                      padding: "5px", // Padding around the close button
                      cursor: "pointer", // Change cursor on hover to indicate interactivity
                    }}
                  >
                    <span
                      className="float-end"
                      style={{
                        fontSize: "30px",
                        color: "#aaa",
                      }}
                    >
                      &times;
                    </span>
                  </button>
                </div>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateSubmit}>
                  <div className="mb-3">
                    <label htmlFor="userName" className="form-label">
                      User Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="userName"
                      value={UserName}
                      onChange={(e) => setUserName(e.target.value)}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="userEmail" className="form-label">
                      User Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="userEmail"
                      value={UserEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="userPassword" className="form-label">
                      User Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="userPassword"
                      value={UserPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="userRole" className="form-label">
                      User Role
                    </label>
                    <select
                      className="form-control"
                      name="userRole"
                      value={UserRole}
                      onChange={(e) => setUserRole(e.target.value)}
                    >
                      <option value="none">Choose Role</option>
                      {GetRoles.map((role, index) => (
                        <option key={index} value={role.Role}>
                          {role.Role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="userImage" className="form-label">
                      User Image
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      name="userImage"
                      onChange={handleImageChangeForModal}
                    />
                    {IMG && (
                      <img
                        src={IMG}
                        alt="Preview"
                        style={{ maxWidth: "100px", marginTop: "10px" }}
                      />
                    )}
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn "
                      style={{ backgroundColor: "#023564", color: "white" }}
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Userdata;
