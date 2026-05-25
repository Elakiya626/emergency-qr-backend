const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    age: Number,

    gender: String,

    dateOfBirth: String,

    nationality: String,

    bloodGroup: String,

    emergencyContactName: String,

    relationship: String,

    emergencyContact: String,

    secondaryEmergencyContact: String,

    allergies: String,

    chronicDiseases: String,

    medicines: String,

    surgeries: String,

    disabilities: String,

    pregnancyStatus: String,

    organDonor: String,

    mentalHealthConditions: String,

    implants: String,

    bloodThinners: String,

    diabetic: String,

    epilepsy: String,

    asthma: String,

    heartDisease: String,

    kidneyDisease: String,

    insuranceProvider: String,

    insuranceNumber: String,

    doctorName: String,

    hospitalName: String,

    doctorPhone: String,

    nationalHealthId: String,

    emergencyNotes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Patient", patientSchema);