const express = require("express");
const cors = require("cors");
const dbConfig = require("./db/dbConfig");
const equipmentRoutes = require("./routes/equipmentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

require("dotenv").config();

// CORS middleware
app.use(cors());
app.use(express.json());

// Use equipment routes
app.use("/api/equipment", equipmentRoutes);

dbConfig
  .query("SELECT 1")
  .then(() => {
    console.log("db connected");
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log("db connection failed. \n" + err));
