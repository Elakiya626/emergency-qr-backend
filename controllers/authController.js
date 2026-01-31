const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");

// ===============================
// REGISTER
// ===============================
exports.register = async (req, res) => {
  try {
    console.log("REQ BODY (REGISTER):", req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// LOGIN
// ===============================
exports.login = async (req, res) => {
  try {
    console.log("REQ BODY (LOGIN):", req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ RETURN USERNAME (VERY IMPORTANT)
    res.status(200).json({
      message: "Login successful",
      username: user.username,
      qrId: user.qrId || null,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// ADD PATIENT DETAILS + GENERATE QR
// ===============================
exports.addPatientDetails = async (req, res) => {
  try {
    console.log("REQ BODY (PATIENT DETAILS):", req.body);

    const {
      username,
      bloodGroup,
      allergies,
      chronicDiseases,
      sugarLevel,
      medicines,
      emergencyContact,
    } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const qrId = uuidv4();

    const user = await User.findOneAndUpdate(
      { username },
      {
        bloodGroup,
        allergies,
        chronicDiseases,
        sugarLevel,
        medicines,
        emergencyContact,
        qrId,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ FIXED QR URL
    const qrUrl = `http://localhost:5000/api/auth/qr/${qrId}`;
    const qrData = await QRCode.toDataURL(qrUrl);

    res.json({
      message: "Patient details saved and QR generated",
      qrId,
      qrData,
    });
  } catch (err) {
    console.error("PATIENT DETAILS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// GET PATIENT INFO BY QR
// ===============================
exports.getPatientByQR = async (req, res) => {
  try {
    const { qrId } = req.params;
    const user = await User.findOne({ qrId });

    if (!user) {
      return res.send("<h2>QR not found</h2>");
    }

    // ✅ MUST BE STRING TEMPLATE (NOT JSX)
    res.send(`
      <html>
        <head>
          <title>Emergency Patient Info</title>
          <style>
            body {
              font-family: Arial;
              background: #f4f4f4;
              padding: 20px;
            }
            .card {
              background: white;
              padding: 20px;
              border-radius: 10px;
              max-width: 400px;
              margin: auto;
              box-shadow: 0 0 10px rgba(0,0,0,0.2);
            }
            h2 {
              text-align: center;
              color: #b91c1c;
            }
            p {
              font-size: 16px;
              margin: 8px 0;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>🚑 Emergency Patient Info</h2>
            <p><strong>Name:</strong> ${user.username}</p>
            <p><strong>Blood Group:</strong> ${user.bloodGroup}</p>
            <p><strong>Allergies:</strong> ${user.allergies}</p>
            <p><strong>Chronic Diseases:</strong> ${user.chronicDiseases}</p>
            <p><strong>Sugar Level:</strong> ${user.sugarLevel}</p>
            <p><strong>Medicines:</strong> ${user.medicines}</p>
            <p><strong>Emergency Contact:</strong> ${user.emergencyContact}</p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("QR FETCH ERROR:", err);
    res.send("<h2>Server Error</h2>");
  }
};
