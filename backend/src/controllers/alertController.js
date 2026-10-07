const Alert = require("../models/Alert");

function getSeverityClass(severity) {
  switch (severity) {
    case "CRITICAL":
      return "critical";

    case "HIGH":
      return "high";

    case "MEDIUM":
      return "medium";

    case "LOW":
      return "low";

    case "INFORMATIONAL":
      return "informational";

    default:
      return "informational";
  }
};

// GET /api/alerts
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ active: true })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    console.error("Get alerts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch alerts",
    });
  }
};

// GET /api/alerts/:id
const getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch alert",
    });
  }
};

// POST /api/alerts
const createAlert = async (req, res) => {
  try {
    const {
      title,
      description,
      severity,
      notification,
      escalation,
      checks,
      actions,
    } = req.body;

    if (!title || !description || !severity) {
      return res.status(400).json({
        success: false,
        message: "Title, description and severity are required",
      });
    }

    const normalizedSeverity = severity.toUpperCase();

    const allowedSeverities = [
      "CRITICAL",
      "HIGH",
      "MEDIUM",
      "LOW",
      "INFORMATIONAL",
    ];

    if (!allowedSeverities.includes(normalizedSeverity)) {
      return res.status(400).json({
        success: false,
        message: "Invalid severity",
      });
    }

    const alert = await Alert.create({
      title,
      description,
      severity: normalizedSeverity,

      // Automatically generated.
      severityClass: getSeverityClass(normalizedSeverity),

      notification,
      escalation,
      checks,
      actions,
    });

    res.status(201).json({
      success: true,
      message: "Alert created successfully",
      data: alert,
    });
  } catch (error) {
    console.error("Create alert error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create alert",
    });
  }
};

module.exports = {
  getAlerts,
  getAlertById,
  createAlert,
};