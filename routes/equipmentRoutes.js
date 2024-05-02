const express = require("express");
const router = express.Router();
const equipmentController = require("../controllers/equipmentController");

// add equipment
router.post("/", equipmentController.addEquipment);

// Get all equipment
router.get("/", equipmentController.getEquipments);

// Get equipment by ID
router.get("/:id", equipmentController.getEquipmentByID);

module.exports = router;
