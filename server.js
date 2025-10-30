// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const EMAIL = process.env.EMAIL;
const APP_PASSWORD = process.env.APP_PASSWORD;

// ✅ Gmail Transporter using App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: APP_PASSWORD,
  },
});


// ✅ Health Check (GET)
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Geofence email backend running" });
});

// ✅ Test Mail (GET instead of POST for easy check)
app.get("/test-mail", async (req, res) => {
  try {
    const mailOptions = {
      from: EMAIL,
      to: EMAIL,
      subject: "GeoFence Test Email",
      text: `This is a test email from GeoFence backend. Time: ${new Date().toISOString()}`,
    };
    await transporter.sendMail(mailOptions);
    console.log("✅ Test email sent successfully");
    res.json({ ok: true, message: "Test email sent successfully!" });
  } catch (err) {
    console.error("❌ Error sending test email:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ✅ Alert Route (POST)
app.post("/send-alert", async (req, res) => {
  try {
    const { latitude, longitude, deviceId = "unknown" } = req.body;

    const mailOptions = {
      from: EMAIL,
      to: EMAIL,
      subject: `🚨 GeoFence Alert: Device ${deviceId} left area`,
      text: `Device ${deviceId} moved OUTSIDE the safe zone.\n\nCoordinates:\nLatitude: ${latitude}\nLongitude: ${longitude}\nTime: ${new Date().toISOString()}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`🚨 Alert email sent for device ${deviceId}`);
    res.json({ ok: true, message: "Alert email sent successfully!" });
  } catch (err) {
    console.error("❌ Error sending alert:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ✅ Listen on all IPs (for mobile testing)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 GeoFence backend running on http://0.0.0.0:${PORT}`);
});

