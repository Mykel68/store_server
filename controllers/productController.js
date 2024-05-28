const db = require("../models");
const { Op } = require("sequelize");

exports.addProducts = async (req, res) => {
  try {
    const {
      model_name,
      serial_number,
      manufacturer,
      department,
      product_class,
    } = req.body;

    if (
      !model_name ||
      !serial_number ||
      !manufacturer ||
      !department ||
      !product_class
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    const product = await db.Product.create({
      model_name,
      serial_number,
      manufacturer,
      department,
      product_class,
    });

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding products:", error);
    res.status(500).json({ error: "Error adding products" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await db.products.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Error getting products" });
  }
};
