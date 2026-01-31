const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* -------------------- ROUTES -------------------- */
const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patient");

app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);

/* -------------------- MODELS -------------------- */
require("./models/User");
console.log("✅ User model loaded");

/* -------------------- TEST ROUTE -------------------- */
app.get("/", (req, res) => {
  res.send("✅ Emergency QR Backend Running");
});

/* -------------------- SERVER + DB -------------------- */
const PORT = process.env.PORT || 5000;

console.log("🔑 MONGO_URI:", process.env.MONGO_URI ? "FOUND" : "NOT FOUND");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

