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


 // PUT /api/alerts/:id
const updateAlert = async (req, res) => {
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

    // Validate required fields
    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof severity !== "string" ||
      !severity.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, description and severity are required",
      });
    }

    // Normalize and validate severity
    const normalizedSeverity = severity.trim().toUpperCase();

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

    // Validate optional list fields
    if (
      (checks !== undefined &&
        (!Array.isArray(checks) ||
          !checks.every((item) => typeof item === "string"))) ||
      (actions !== undefined &&
        (!Array.isArray(actions) ||
          !actions.every((item) => typeof item === "string")))
    ) {
      return res.status(400).json({
        success: false,
        message: "Checks and actions must be arrays of strings",
      });
    }

    // Update the existing MongoDB document
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        description: description.trim(),
        severity: normalizedSeverity,
        severityClass: getSeverityClass(normalizedSeverity),
        notification,
        escalation,
        checks,
        actions,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Alert updated successfully",
      data: alert,
    });
  } catch (error) {
    console.error("Update alert error:", error);

    if (
      error.name === "CastError" ||
      error.name === "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID or alert data",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update alert",
    });
  }
};

const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Alert permanently deleted",
      data: alert,
    });
  } catch (error) {
    console.error("Delete alert error:", error);

    return res.status(400).json({
      success: false,
      message: "Unable to delete alert. Check the alert ID.",
    });
  }
};

module.exports = {
  getAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert,
};