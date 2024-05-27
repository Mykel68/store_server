const router = express.Router();
const equipmentController = require("../controllers/manufacturerController");

// Register manufacturer
router.post("/register-manufacturer", equipmentController.registerManufacturer);