const express = require("express");
const router = express.Router();
const manufacturerController = require("../controllers/manufacturerController");

// Register manufacturer
router.post("/", manufacturerController.registerManufacturer);

// Get all manufacturers
router.get("/", manufacturerController.getManufacturers);

module.exports = router;
