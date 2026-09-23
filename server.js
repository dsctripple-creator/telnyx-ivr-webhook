const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Telnyx IVR webhook is running!");
});

// Existing webhook
app.post("/webhook", (req, res) => {
  console.log("Telnyx event received:", req.body);

  res.status(200).json({
    received: true
  });
});

// TEMPORARY: show Telnyx voice connections
app.get("/connections", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.telnyx.com/v2/connections?filter[connection_type]=voice",
      {
        headers: {
          Authorization: `Bearer ${process.env.TELNYX_API_KEY}`,
          Accept: "application/json"
        }
      }
    );

    const data = await response.json();

    console.log("Telnyx connections:", JSON.stringify(data, null, 2));

    res.status(response.status).json(data);
  } catch (error) {
    console.error("Connection lookup error:", error);
    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
