const pool = require("../db/dbConfig");

exports.addEquipment = async (req, res) => {
  const {
    manufacturer,
    product_class,
    function_,
    product,
    store_item,
    purchase,
    vendor,
  } = req.body;

  try {
    // Execute the query using pool.query() inside try block
    const sql =
      "INSERT INTO equipment (manufacturer, product_class, function_, product, store_item, purchase, vendor) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [
      manufacturer,
      product_class,
      function_,
      product,
      store_item,
      purchase,
      vendor,
    ];
    const results = await pool.query(sql, values);
    res.status(201).json({
      message: "Equipment created successfully",
      equipmentId: results.insertId,
    });
  } catch (error) {
    console.error("Error creating equipment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getEquipments = async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM equipment");
    if (!data || data.length === 0) {
      res.status(404).send({
        message: "No data found",
        success: false,
      });
      return;
    }
    res.status(200).send({
      message: "Data fetched successfully",
      success: true,
      totalEquipment: data.length,
      data,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error getting all equipment",
      success: false,
      error,
    });
  }
};

exports.getEquipmentByID = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pool.query("SELECT * FROM equipment WHERE id = ?", [id]);
    if (!data || data.length === 0) {
      res.status(404).send({
        message: "No data found",
        success: false,
      });
      return;
    }
    res.status(200).send({
      message: "Data fetched successfully",
      success: true,
      data: data[0],
    });
  } catch (error) {
    console.error("Error fetching equipment:", error);
    res.status(500).send({
      message: "Internal Server Error",
      success: false,
      error,
    });
  }
};
