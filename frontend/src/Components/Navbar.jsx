import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{ backgroundColor: "#011b33" }} // Inline style for deep blue color
      >
        <div className="container-fluid" style={{ textAlign: "center" }}>
          <Link className="navbar-brand" to="/" style={{ color: "white" }}>
            FSWAP
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/"
                  style={{ color: "white" }} // Ensuring text is white for contrast
                >
                  Add User
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/userlist"
                  style={{ color: "white" }} // Ensuring text is white for contrast
                >
                  User List
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
