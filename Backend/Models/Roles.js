const mongoose = require("mongoose");

const Roles_Model = mongoose.Schema({
    Role_Name:{type:String , require :[true,"Role name required"],},
    Role_Status:{type:String , require :[true,"Status is required"],}
})
const userRole = mongoose.model("userRole", Roles_Model)

module.exports = { userRole };