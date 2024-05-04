const db = require("../config/dbConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  // Check if all fields are present
  if (!name || !email || !password) {
    console.log("Missing required fields");
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log("Invalid email format");
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // Check if email already exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    console.log(existingUser);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Validate password length
    if (password.length < 6) {
      console.log("Password length is too short");
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const values = [name, email, hashedPassword];
    await db.query(sql, values);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error checking existing user or creating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "All are Credentials are required" });
  }

  try {
    // Retrieve user from the database
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // Check if user exists
    if (user.length === 0) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    // Compare password hash
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Not valid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send token to the client
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error retrieving user or comparing password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
