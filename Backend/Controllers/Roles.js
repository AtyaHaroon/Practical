//---Model
const { userRole } = require("../Models/Roles");

//Method ----- GET
//Api ------ http://localhost:5000/role
//Description ----- Get all user role

async function getRole(req, res) {
  const AllRoles = await userRole.find();
  return res.status(200).send({ data: AllRoles });
}

//Method ----- POST
//Api ------ http://localhost:5000/role
//Description ----- Insertion of user role

async function createRole(req, res) {
  const { Role } = req.body;
  // -- Check user Role already exists or not
  const roleExist = await userRole.find({ Role: Role.toLowerCase() });

  // -- Checker of User input
  const roleName_checker = /^[A-Za-z]+$/;

  if (roleName_checker.test(Role)) {
    if (roleExist.length > 0)
      return res.send({ error: "Already exixts in database" });

    const newRole = await userRole.create({
      Role: Role,
    });

    return res.status(201).send({ data: req.body });
  } else {
    return res.send({
      error: "Special Character,extra spaces or number is not valid",
    });
  }
}

module.exports = { createRole, getRole };
