const express = require("express");

const {
  getAlerts,
  getAlertById,
  createAlert,
  deleteAlert,
} = require("../controllers/alertController");

const router = express.Router();

router.get("/", getAlerts);

router.get("/:id", getAlertById);

router.post("/", createAlert);

router.delete("/:id", deleteAlert);

module.exports = router;