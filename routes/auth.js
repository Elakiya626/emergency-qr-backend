const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  register,
  login,
  addPatientDetails,
  getPatientByQR,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/patient-details", addPatientDetails);
router.get("/qr/:qrId", authController.getPatientByQR);

router.post("/login", authController.login);

module.exports = router;
