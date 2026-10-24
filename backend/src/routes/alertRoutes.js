const express = require("express");

const {
  getAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  getAlertActivity,
  getActivitySummary,
  getRecentActivity,
  deleteAlert,
} = require("../controllers/alertController");

console.log("Route handler diagnostic:", {
  getAlerts: typeof getAlerts,
  getAlertById: typeof getAlertById,
  createAlert: typeof createAlert,
  updateAlert: typeof updateAlert,
  getAlertActivity: typeof getAlertActivity,
  getActivitySummary: typeof getActivitySummary,
  deleteAlert: typeof deleteAlert,
});

const router = express.Router();

router.get("/", getAlerts);
router.post("/", createAlert);

router.get("/activity/summary", getActivitySummary);
router.get("/:id/activity", getAlertActivity);
router.get("/activity/recent", getRecentActivity);
router.get("/:id", getAlertById);

router.put("/:id", updateAlert);
router.delete("/:id", deleteAlert);

module.exports = router;