const mongoose = require("mongoose");

const UserAcc_Model = mongoose.Schema({
  userName: { type: String },
  userEmail: { type: String },
  userPassword: { type: String },
  userImage: { type: String },
  UserRole: { type: String },
});
const userAccount = mongoose.model("userAccount", UserAcc_Model);

module.exports = { userAccount };
