const router = require("express").Router();
const authController = require("../controllers/productController");

router.post("/register", authController.addProducts);

module.exports = router;
