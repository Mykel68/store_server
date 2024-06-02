const db = require("../models");
const { Op } = require("sequelize");

exports.registerManufacturer = async (req, res) => {
  try {
    const { name, email, phone_number, address, country , country_code} = req.body;

    // Check if all required fields are provided
    const requiredFields = [name, email, phone_number, address, country , country_code];
    if (requiredFields.some((field) => !field)) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate phone number format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone_number)) {
      return res
        .status(400)
        .json("Invalid phone number format. It should be 10 digits");
    }

    // Check if the manufacturer with the same email already exists
    const existingManufacturer = await db.Manufacturer.findOne({
      where: { email },
    });
    if (existingManufacturer) {
      return res
        .status(409)
        .json({ error: "Manufacturer with this email already exists" });
    }

    // Create the new manufacturer
    const newManufacturer = await db.Manufacturer.create({
      name,
      email,
      phone_number,
      address,
      country,
      country_code
    });

    res.status(201).json(newManufacturer);
  } catch (error) {
    console.error("Error registering manufacturer:", error);
    res.status(500).json({ error: "Error registering manufacturer" });
  }
};

exports.getManufacturers = async (req, res) => {
  try {
    const manufacturers = await db.Manufacturer.findAll();
    res.status(200).json(manufacturers);
  } catch (error) {
    console.error("Error getting manufacturers:", error);
    res.status(500).json({ error: "Error getting manufacturers" });
  }
};
