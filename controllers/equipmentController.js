const db = require("../models");
const { Op } = require("sequelize");
const { ValidationError } = require("sequelize");

exports.registerEquipment = async (req, res) => {
  // console.log("db.registeredEquipments:", db.registeredEquipments);
  // console.log("db.equipments:", db.equipments);
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
      department,
      product_class,
      sub_class,
      manufacturer,
      function_,
      product,
      store_item,
      purchase,
      vendor,
      model_name,
      serial_number,
    } = req.body;

    // Check if the registered equipment exists
    const registeredEquipment = await db.registeredEquipments.findOne({
      where: { model_name },
    });
    if (!registeredEquipment) {
      return res.status(404).json({ error: "Registered equipment not found" });
    }

    // Generate the store code
    const storeCode = await generateStoreCode(
      department,
      product_class,
      sub_class
    );

    // Insert the equipment details
    const equipmentResult = await db.equipments.create({
      department,
      serial_number,
      model_name,
      manufacturer,
      product_class,
      sub_class,
      function_,
      product,
      store_item,
      purchase,
      vendor,
      store_code: storeCode,
    });

    // Return the equipment details and the store code
    res.status(200).json({
      equipment: equipmentResult,
      store_code: storeCode,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ error: error.errors.map((e) => e.message) });
    }
    console.error("Error creating equipment:", error);
    res.status(500).json({ error: "Error creating equipment" });
  }
};

async function generateStoreCode(department, product_class, sub_class) {
  try {
    // Check if there are any existing equipment with the same department, product_class, and sub_class
    const existingEquipment = await db.equipments.findAll({
      where: {
        department,
        product_class,
        sub_class,
      },
      order: [["id", "DESC"]],
      limit: 1,
    });

    let id = 1;
    if (existingEquipment.length > 0) {
      id = existingEquipment[0].id + 1;
    }

    return `${department}/${product_class}/${sub_class}/${id}`;
  } catch (error) {
    console.error("Error generating store code:", error);
    throw new Error("Error generating store code");
  }
}

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

exports.searchEquipment = async (req, res) => {
  try {
    const { query } = req.query;

    // Validate the query parameter
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({ error: "Invalid search query" });
    }

    const searchQuery = `%${query.trim()}%`;

    // Search for registered equipment
    const registeredEquipment = await db.registeredEquipments.findAll({
      where: {
        [Op.or]: [
          { model_name: { [Op.like]: searchQuery } },
          { model_number: { [Op.like]: searchQuery } },
          { product_class: { [Op.like]: searchQuery } },
        ],
      },
      include: {
        model: db.equipments,
        as: "equipment",
      },
    });

    // Search for equipment
    const equipment = await db.equipments.findAll({
      where: {
        [Op.or]: [
          { serial_number: { [Op.like]: searchQuery } },
          { manufacturer: { [Op.like]: searchQuery } },
          { product_class: { [Op.like]: searchQuery } },
          { product: { [Op.like]: searchQuery } },
          { store_item: { [Op.like]: searchQuery } },
          { vendor: { [Op.like]: searchQuery } },
        ],
      },
      include: {
        model: db.registeredEquipments,
        as: "registeredEquipment",
      },
    });

    const result = [...registeredEquipment, ...equipment];

    if (result.length === 0) {
      return res.status(200).json({ message: "No equipment found" });
    }

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error("Validation error:", error);
      return res
        .status(400)
        .json({ error: error.errors.map((e) => e.message) });
    }

    console.error("Error searching equipment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
