const express = require("express");
const router = express.Router();
const equipmentController = require("../controllers/equipmentController");

// Register equipment
router.post("/register-equipment", equipmentController.registerEquipment);

// Add equipment
router.post("/", equipmentController.addEquipment);

// Get all equipment
router.get("/", equipmentController.getEquipments);

// Get equipment by ID
router.get("/:id", equipmentController.getEquipment);

module.exports = router;
