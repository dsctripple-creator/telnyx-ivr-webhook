const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Your Telnyx details
const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
const CONNECTION_ID = "3055379527111804158";
const FROM_NUMBER = "+18022327369";
const WEBHOOK_URL = "https://telnyx-ivr-webhook-xuo9.onrender.com/webhook";

// Health check
app.get("/", (req, res) => {
  res.send("Telnyx IVR webhook is running!");
});

// Test webhook
app.post("/webhook", (req, res) => {
  console.log("Telnyx event received:", req.body);

  res.status(200).json({
    received: true
  });
});

// Make outbound test call
app.get("/call", async (req, res) => {
  try {
    const to = req.query.to;

    if (!to) {
      return res.status(400).json({
        error: "Missing ?to= phone number"
      });
    }

    const response = await fetch("https://api.telnyx.com/v2/calls", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TELNYX_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        connection_id: CONNECTION_ID,
        to: to,
        from: FROM_NUMBER,
        webhook_url: WEBHOOK_URL
      })
    });

    const data = await response.json();

    console.log("Telnyx call response:", data);

    res.status(response.status).json(data);

  } catch (error) {
    console.error("Call error:", error);

    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
