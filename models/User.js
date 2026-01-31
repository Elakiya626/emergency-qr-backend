const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bloodGroup: String,
  allergies: String,
  chronicDiseases: String,
  sugarLevel: String,
  medicines: String,
  emergencyContact: String,
  photo: String,
medicalPdf: String,

  qrId: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
