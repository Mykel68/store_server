const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const dbConfig = require("./db/dbConfig");

const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables from .env file
require("dotenv").config();

// CORS middleware
app.use(cors());

// MySQL connection configuration
const connection = mysql.createConnection(dbConfig);

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database: ", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Define routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
