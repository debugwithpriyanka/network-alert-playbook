
const express = require("express");

const {
  getAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  getAlertActivity,
  deleteAlert,
} = require("../controllers/alertController");

const router = express.Router();

router.get("/", getAlerts);
router.post("/", createAlert);

router.get("/:id/activity", getAlertActivity);
router.get("/:id", getAlertById);

router.put("/:id", updateAlert);
router.delete("/:id", deleteAlert);

module.exports = router;