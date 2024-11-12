//-- Model
const { userAccount } = require("../Models/UserAcc");
const { userRole } = require("../Models/Roles");
//---  Import bcrypt for hashing passwords
const bcrypt = require("bcryptjs");

//Method ----- GET
//Api ------ http://localhost:5000/user
//Description ----- Get all users

async function getUser(req, res) {
  const AllUsers = await userAccount.find();
  return res.status(200).send({ data: AllUsers });
}

//Method ----- POST
//Api ------ http://localhost:5000/user
//Description ----- Insertion of new user

async function createUser(req, res) {
  try {
    const { userName, userEmail, userPassword, UserRole, userimage } = req.body;

    // -- Regular expressions for input validation
    const userName_checker = /^[A-Za-z]+$/; // User name should contain only letters (no spaces, special chars, or digits)
    const userEmail_checker = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/; // Valid email pattern
    const userPassword_checker = /^(?!\s*$)[A-Za-z0-9]+$/;

    // -- Validate userName
    if (!userName_checker.test(userName)) {
      return res.send({
        error:
          "User name should only contain letters, no spaces, numbers, or special characters.",
      });
    }

    // -- Validate userEmail
    if (!userEmail_checker.test(userEmail)) {
      return res.send({
        error: "Invalid email format.",
      });
    }

    // -- Validate userPassword
    if (!userPassword_checker.test(userPassword)) {
      return res.send({
        error:
          "Password must be at least 8 characters long and contain at least one lowercase, one uppercase, one digit, and one special character.",
      });
    }

    // -- Check if email already exists in the database
    const emailExists = await userAccount.findOne({
      userEmail: userEmail.toLowerCase(),
    });
    if (emailExists) {
      return res.send({ error: "Email already exists in the database." });
    }

    // -- Hash the password before saving
    const hashedPassword = await bcrypt.hash(userPassword, 10); // Hash with 10 rounds of salt

    // -- Create a new user if all validations pass
    const newUser = await userAccount.create({
      userName: userName,
      userEmail: userEmail,
      userPassword: hashedPassword, // Save the hashed password
      UserRole: UserRole,
      userimage: userimage,
    });

    // -- Respond with success
    return res.status(201).send({ data: newUser });
  } catch (error) {
    return res.status(401).send({ error: error });
  }
}

//Method ----- DELETE
//Api ------ http://localhost:5000/user/:id
//Description ----- Delete single user

async function deleteUser(req, res) {
  try {
    //Finding Role exists or not
    const findUser = await userAccount.find({
      userName: req.params.id.toLowerCase(),
    });

    // Condition if Role not exists their lenght will not be greater than 0
    if (findUser.length <= 0)
      return res.send({ error: "not defined in Database" });
    //To delete
    const deleteRole = await userAccount.deleteOne({ userName: req.params.id });

    return res.status(200).send("Role deleted !!");
  } catch (error) {
    console.log(error);
  }
}

//Method -------  UPDATE
//Api   --------  http://localhost:5000/role/:id
//Description --  Update user Details

async function updateUser(req, res) {
  // User record id to update
  const updateUserID = req.params.id;
  // User Old Data
  const old_User_data = await userAccount.find({
    userName: updateUserID.toLowerCase(),
  });

  console.log(old_User_data.userName);

  // User New data
  const { userName, userEmail, userPassword, UserRole, userimage } = req.body;
  // Update User Data
  const updateUserData = await userAccount.updateOne(
    {
      userName,
      userEmail,
      userPassword,
      userRole,
      userimage,
    },
    {
      $set: {
        userName: userName,
        userEmail: userEmail,
        userPassword: userPassword,
        userRole: UserRole,
        userimage: userimage,
      },
    }
  );
  return res.send({ message: "user updated successfully" });
}
module.exports = { getUser, createUser, deleteUser, updateUser };
