const express = require("express");

const app = express();
const cors = require("cors");
//--- env
require("dotenv").config();

//--- Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());

//--- db
const { connectionDB } = require("./Config/Database");

//--- Models - import
const {
  getUser,
  createUser,
  deleteUser,
  updateUser,
} = require("./Controllers/User");
const { createRole, getRole } = require("./Controllers/Roles");
// User Api [GET,POST]
app.route("/user").get(getUser).post(createUser);

// User Api [DELETE , Update]
app.route("/user/:id").delete(deleteUser).put(updateUser);

// User role Api [GET,POST]
app.route("/role").get(getRole).post(createRole);
app.listen(process.env.PORT, function () {
  console.log(`The server is runing on the port ${process.env.PORT}`);
  connectionDB();
});
