const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const Patient = require("../models/Patient");

/* ---------------- AUTH ---------------- */

router.post("/register", authController.register);

router.post("/login", authController.login);

/* ---------------- SAVE PATIENT DETAILS ---------------- */

router.post("/patient-details", async (req, res) => {

  try {

    const patient = new Patient(req.body);

    await patient.save();

    res.status(201).json({
      message: "Patient details saved successfully",
      qrId: patient._id,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

});

/* ---------------- GET PATIENT BY QR ---------------- */

router.get("/patient/:id", async (req, res) => {

  try {

    const patient = await Patient.findById(
      req.params.id
    );

    if (!patient) {

      return res.status(404).json({
        message: "Patient not found",
      });

    }

    res.json(patient);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

});

module.exports = router;