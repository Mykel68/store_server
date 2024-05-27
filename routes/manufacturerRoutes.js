const express = require("express");
const router = express.Router();
const equipmentController = require("../controllers/manufacturerController");

// Register manufacturer
router.post("/register-manufacturer", equipmentController.registerManufacturer);

// Get all manufacturers
router.get("/", equipmentController.getManufacturers);
module.exports = router;
