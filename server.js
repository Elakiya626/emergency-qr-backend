const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

/* ---------------- LOAD ENV ---------------- */

dotenv.config();

/* ---------------- APP ---------------- */

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

/* ---------------- MODELS ---------------- */

require("./models/User");
require("./models/Patient");

console.log("✅ User & Patient models loaded");

/* ---------------- ROUTES ---------------- */

const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);

/* Optional */
app.use("/api", authRoutes);

/* ---------------- TEST ROUTE ---------------- */

app.get("/", (req, res) => {
  res.send("✅ Emergency QR Backend Running");
});

/* ---------------- PORT ---------------- */

const PORT = process.env.PORT || 5000;

/* ---------------- DATABASE CONNECTION ---------------- */

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in environment variables");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("🔥 FULL ERROR BELOW:");
    console.error(err);
  });