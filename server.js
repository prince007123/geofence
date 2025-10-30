import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(express.json());

// 🔹 Root route check
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "✅ GeoFence backend running with Resend API" });
});

// 🔹 Send email alert
app.post("/alert", async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL,
        to: process.env.TO_EMAIL,
        subject: "⚠️ GeoFence Alert",
        html: `
          <h2>🚨 User Left GeoFence Area!</h2>
          <p><b>Latitude:</b> ${latitude}</p>
          <p><b>Longitude:</b> ${longitude}</p>
          <p>Check location on <a href="https://maps.google.com/?q=${latitude},${longitude}">Google Maps</a></p>
        `,
      }),
    });

    const data = await response.json();
    console.log("✅ Email sent:", data);
    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔹 Test mail route
app.get("/test-mail", async (req, res) => {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL,
        to: process.env.TO_EMAIL,
        subject: "✅ Test Mail from GeoFence Backend",
        html: "<p>This is a test email — backend working perfectly! 🚀</p>",
      }),
    });

    const data = await response.json();
    console.log("Test Mail Sent:", data);
    res.json({ message: "Test email sent successfully!", data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to send test email" });
  }
});

app.listen(3000, "0.0.0.0", () =>
  console.log("🚀 GeoFence backend running on port 3000")
);


