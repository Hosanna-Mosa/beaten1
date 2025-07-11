const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const { protect } = require("../middleware/auth");

// Add a new address
router.post("/", protect, addressController.addAddress);
// Get all addresses for the user
router.get("/", protect, addressController.getAddresses);
// Update an address
router.put("/:id", protect, addressController.updateAddress);
// Delete an address
router.delete("/:id", protect, addressController.deleteAddress);

module.exports = router; 