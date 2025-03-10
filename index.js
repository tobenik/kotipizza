const express = require("express");
const fs = require("fs");
const path = require("path");
const { validateOrder } = require("./validation");

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, "orders.json");

// Middleware
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Order endpoint with validation
app.post("/order", (req, res) => {
  try {
    const validationResult = validateOrder(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation error",
        details: validationResult.error.format(),
      });
    }

    const { phoneNumber, address, items } = validationResult.data;

    const newOrder = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      phoneNumber,
      address,
      items,
      status: "received",
    };

    // Read existing orders or create empty array
    let orders = [];
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf8");
      orders = JSON.parse(data);
    }

    // Add new order and save to file
    orders.push(newOrder);
    fs.writeFileSync(DB_FILE, JSON.stringify(orders, null, 2));

    res.status(201).json({
      message: "Order placed successfully",
      orderId: newOrder.id,
    });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ error: "Failed to process order" });
  }
});

// ElevenLabs webhook endpoint for Twilio call information
app.post("/webhook/elevenlabs", (req, res) => {
  try {
    const { caller_id, agent_id, called_number, call_sid } = req.body;

    // Validate required parameters
    if (!caller_id || !agent_id) {
      return res.status(400).json({
        error: "Missing required parameters",
      });
    }

    console.log(
      `Received call from: ${caller_id} to: ${called_number}, agent: ${agent_id}, call_sid: ${call_sid}`
    );

    // Return only dynamic variables without overriding agent configuration
    return res.status(200).json({
      dynamic_variables: {
        phone_number: caller_id,
        call_time: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Failed to process webhook request" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
