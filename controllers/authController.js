const db = require("../db/dbConfig");
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
    const existingUser = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    // if (existingUser.length > 0) {
    //   console.log("Email already exists:", email);
    //   return res.status(400).json({ message: "Email already exists" });
    // }

    // Validate password length
    if (password.length < 6) {
      console.log("Password length is too short");
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Perform the database insertion with hashed password
    const values = [name, email, hashedPassword];
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        console.log("User created successfully");
        res.status(201).json({ message: "User created successfully" });
      }
    });
  } catch (error) {
    console.error("Error checking existing user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  const values = [email];

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "All Credentials are required" });
  }

  // Retrieve user from the database
  db.query(sql, values, async (err, results) => {
    if (err) {
      console.error("Error retrieving user:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // Check if user exists
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Compare password hash
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send token to the client
    res.status(200).json({ token });
  });
};
