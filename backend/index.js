require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./src/config/db");
const PORT = process.env.PORT || 5000;

// Routes
const neighborhoodRoutes = require("./src/routes/neighborhoodRoute");
const userRoutes = require("./src/routes/userRoute");
const itemRoutes = require("./src/routes/itemRoute");
const bookingRoutes = require("./src/routes/bookingRoute");
const reviewRoutes = require("./src/routes/reviewRoute");

// Middleware to parse incoming JSON payloads
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/neighborhoods", neighborhoodRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/borrow-requests", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

// Custom stats endpoint for the frontend dashboard
app.get("/api/stats", async (_req, res) => {
  try {
    const itemCount = await pool.query("SELECT COUNT(*) FROM items");
    const userCount = await pool.query("SELECT COUNT(*) FROM users");
    const neighborhoodCount = await pool.query(
      "SELECT COUNT(*) FROM neighborhoods",
    );

    res.json({
      success: true,
      totalTools: parseInt(itemCount.rows[0].count, 10),
      totalItems: parseInt(itemCount.rows[0].count, 10),
      activeBorrowers: parseInt(userCount.rows[0].count, 10),
      neighborhoods: parseInt(neighborhoodCount.rows[0].count, 10),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Start listening for client requests
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
