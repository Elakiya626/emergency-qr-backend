const express = require("express");
const router = express.Router();

const Patient = require("../models/Patient");

/* ----------------------------------------
   GET PATIENT DETAILS USING QR ID
---------------------------------------- */
router.get("/:qrId", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.qrId);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.json(patient);

  } catch (error) {
    console.log("Error fetching patient:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;