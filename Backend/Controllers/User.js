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

//------------------------------------------------------

//Method ----- POST
//Api ------ http://localhost:5000/user
//Description ----- Insertion of new user

async function createUser(req, res) {
  try {
    const { userName, userEmail, userPassword, userRole } = req.body;

    // Handle the uploaded user image (if any)
    const userImage = req.file;
    if (userImage) {
      console.log("Uploaded image:", userImage);
    }

    const User_Image = userImage ? userImage.path : null;
    const fileID = userImage ? userImage.filename : null;

    // Check if email already exists in the database
    const checkData = await userAccount.findOne({ userEmail });
    if (checkData) {
      return res.status(400).send({ error: "Email already exists" });
    }

    // Regular expressions for input validation
    const userName_checker = /^[A-Za-z0-9\s\-]{3,}$/; // Allow letters, numbers, spaces, and hyphens
    const userEmail_checker = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/; // Gmail or Yahoo emails only

    // Validate username
    if (!userName_checker.test(userName)) {
      return res.status(400).send({
        error:
          "User name should only contain letters, numbers, spaces, or hyphens and be at least 3 characters long.",
      });
    }

    // Validate email
    if (!userEmail_checker.test(userEmail)) {
      console.log("Email validation failed for:", userEmail);
      return res
        .status(400)
        .send({ error: "Only Gmail and Yahoo emails are accepted" });
    }

    // Hash the password
    const PasswordHash = await bcrypt.hash(userPassword, 10);

    // Create the user in the database
    try {
      const newUser = await userAccount.create({
        userName,
        userEmail,
        userImage: User_Image,
        userImageID: fileID,
        userPassword: PasswordHash,
        userRole,
      });

      // Return a success response with the user data (but avoid sending sensitive info like password)
      return res.status(201).send({
        data: "User added successfully",
        user: { userName, userEmail, userRole },
      });
    } catch (error) {
      console.error("Error creating user:", error); // Log detailed error for debugging purposes
      return res
        .status(500)
        .send({ error: "Internal server error. Could not create user." });
    }
  } catch (error) {
    console.error("Unexpected error:", error); // Log unexpected errors
    return res
      .status(500)
      .send({ error: "An unexpected error occurred. Please try again later." });
  }
}

//Method ----- DELETE
//Api ------ http://localhost:5000/user/:id
//Description ----- Delete single user
async function deleteUser(req, res) {
  try {
    // Find the user by userName (case insensitive)
    const finduser = await userAccount.findOne({
      userName: req.params.id.toLowerCase(),
    });

    // If user doesn't exist, send an error response
    if (!finduser) {
      return res.status(404).json({ error: "User not found in database" });
    }

    // Delete the user by userName (case insensitive)
    await userAccount.deleteOne({ userName: req.params.id.toLowerCase() });

    // Send success response
    return res.status(200).json({ data: "User deleted successfully !!" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

//Method -------  UPDATE
//Api   --------  http://localhost:5000/user/:id
//Description --  Update user Details

async function updateUser(req, res) {
  try {
    // Extract the userName from the URL (you are identifying by userName here)
    const updateUserName = req.params.id.toLowerCase(); // userName for URL params

    // Find existing user data by userName (not _id)
    const oldUserData = await userAccount.findOne({
      userName: updateUserName, // Query by userName
    });

    if (!oldUserData) {
      return res.status(404).send({ error: "User not found" });
    }

    // New data from the request body
    const { userName, userEmail, userPassword, userRole } = req.body;

    // File upload handling (if a new image is uploaded)
    let userImagePath = oldUserData.userImage; // Keep old image if no new image
    let fileID = oldUserData.userImageID;

    // If a new image is uploaded, update the image
    if (req.file) {
      userImagePath = req.file.path;
      fileID = req.file.filename;
    }

    // Validate inputs (you can improve validation as per your needs)
    const namePattern = /^[A-Za-z0-9\s-]{3,}$/; // Allowing spaces and hyphens
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com)$/;

    if (!namePattern.test(userName)) {
      return res.status(400).json({
        error:
          "User name should only contain letters, numbers, spaces, or hyphens, and be at least 3 characters long.",
      });
    }

    if (!emailPattern.test(userEmail)) {
      return res
        .status(400)
        .json({ error: "Only Gmail, Yahoo, and Hotmail emails are accepted." });
    }

    // Hash password if provided (update if new password is provided)
    let hashedPassword = oldUserData.userPassword;
    if (userPassword) {
      hashedPassword = await bcrypt.hash(userPassword, 10);
    }

    // Update user data in the database (query by userName, not _id)
    const updateResult = await userAccount.updateOne(
      { userName: updateUserName }, // Using userName for the query
      {
        $set: {
          userName,
          userEmail,
          userPassword: hashedPassword, // Update password if provided
          userRole, // Assuming this field is part of the body
          userImage: userImagePath,
          userImageID: fileID,
        },
      }
    );

    // Check if the update operation was successful
    if (updateResult.modifiedCount === 0) {
      return res.status(500).send({ error: "Failed to update user" });
    }

    return res.status(200).send({ data: "User updated successfully" });
  } catch (error) {
    console.error("Error during user update:", error);
    return res
      .status(500)
      .send({ error: "An error occurred during the update" });
  }
}
module.exports = { getUser, createUser, deleteUser, updateUser };
