const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const alertRoutes = require("./routes/alertRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Network Alert Playbook backend is running",
  });
});

app.use("/api/alerts", alertRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});