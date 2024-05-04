const db = require("../models");

exports.registerEquipment = async (req, res) => {
  console.log("db.registeredEquipments:", db.registeredEquipments);
  console.log("db.equipments:", db.equipments);
  try {
    const {
      model_name,
      model_number,
      product_class,
      manufacturer_id,
      power_rating,
      weight,
      dimensions,
      quantity,
    } = req.body;

    // Check if all required fields are provided
    if (
      !model_name ||
      !model_number ||
      !product_class ||
      !manufacturer_id ||
      !power_rating ||
      !weight ||
      !dimensions ||
      !quantity
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // Check if the equipment model is already registered
    const registeredEquipment = await db.registeredEquipments.findOne({
      where: { model_number },
    });
    if (registeredEquipment) {
      return res
        .status(409)
        .json({ error: "Equipment model already registered" });
    }

    // Create the new registered equipment
    const newRegisteredEquipment = await db.registeredEquipments.create({
      model_name,
      model_number,
      product_class,
      manufacturer_id,
      power_rating,
      weight,
      dimensions,
      quantity,
    });

    res.status(200).json(newRegisteredEquipment);
  } catch (error) {
    console.error("Error registering equipment:", error);
    res.status(500).json({ error: "Error registering equipment" });
  }
};

// Add Equipment
exports.addEquipment = async (req, res) => {
  try {
    const {
      manufacturer,
      product_class,
      function_,
      product,
      store_item,
      purchase,
      vendor,
      registered_equipment_id,
      serial_number,
    } = req.body;

    // Check if the registered equipment exists
    const registeredEquipment = await db.registeredEquipments.findByPk(
      registered_equipment_id
    );
    if (!registeredEquipment) {
      return res.status(404).json({ error: "Registered equipment not found" });
    }

    // Insert the equipment details
    const equipmentResult = await db.equipments.create({
      manufacturer,
      product_class,
      function_,
      product,
      store_item,
      purchase,
      vendor,
      registered_equipment_id,
      serial_number,
    });

    res.status(200).json(equipmentResult);
  } catch (error) {
    console.error("Error creating equipment:", error);
    res.status(500).json({ error: "Error creating equipment" });
  }
};

exports.getEquipments = async (req, res) => {
  try {
    const equipments = await db.equipments.findAll();
    res.status(200).json(equipments);
  } catch (error) {
    console.error("Error getting equipments:", error);
    res.status(500).json({ error: "Error getting equipments" });
  }
};

exports.getEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await db.equipments.findByPk(id);
    if (!equipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }
    res.status(200).json(equipment);
  } catch (error) {
    console.error("Error getting equipment:", error);
    res.status(500).json({ error: "Error getting equipment" });
  }
};

exports.updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      manufacturer,
      product_class,
      function_,
      product,
      store_item,
      purchase,
      vendor,
    } = req.body;
    const [updatedRowCount, [updatedEquipment]] = await db.equipments.update(
      {
        manufacturer,
        product_class,
        function_,
        product,
        store_item,
        purchase,
        vendor,
      },
      {
        where: { id },
        returning: true,
      }
    );
    if (updatedRowCount === 0) {
      return res.status(404).json({ error: "Equipment not found" });
    }
    res.status(200).json(updatedEquipment);
  } catch (error) {
    console.error("Error updating equipment:", error);
    res.status(500).json({ error: "Error updating equipment" });
  }
};

exports.deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRowCount = await db.equipments.destroy({
      where: { id },
    });
    if (deletedRowCount === 0) {
      return res.status(404).json({ error: "Equipment not found" });
    }
    res.status(200).json({ message: "Equipment deleted" });
  } catch (error) {
    console.error("Error deleting equipment:", error);
    res.status(500).json({ error: "Error deleting equipment" });
  }
};
