const mongoose = require("mongoose");

const UserAcc_Model = mongoose.Schema({
  userName: { type: String, require: [true, "Name Required"] },
  userEmail: { type: String, require: [true, "Email Requiered"] },
  userImage: { type: String, require: [true, "Image Requiered"] },
  userImageID: { type: String },
  userPassword: { type: String, require: [true, "Password Requiered"] },
  userRole: { type: String, require: [true, "Role Requiered"] },
});
const userAccount = mongoose.model("userAccount", UserAcc_Model);

module.exports = { userAccount };
