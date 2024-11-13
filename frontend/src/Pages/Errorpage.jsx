import React from "react";

const Errorpage = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center mt-5"
    >
      <div className="text-center mt-5">
        <div className="not-found-container mt-5">
          <div className="not-found-content">
            <h1>404</h1>
            <h2>Oops! Page not found.</h2>
            <p>Sorry, we couldn't find the page you're looking for.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Errorpage;
