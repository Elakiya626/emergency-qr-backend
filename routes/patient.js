const express = require("express");
const router = express.Router();
const User = require("../models/User");

// PUBLIC route – no login needed
router.get("/:qrId", async (req, res) => {
  try {
    const user = await User.findOne({ qrId: req.params.qrId })
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
