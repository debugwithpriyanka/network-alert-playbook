const mongoose = require("mongoose");
const Alert = require("../models/Alert");
const AlertActivity = require("../models/AlertActivity");

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
}

const allowedSeverities = [
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
  "INFORMATIONAL",
];

function validateAlertBody(body) {
  const { title, description, severity, checks, actions } = body;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof description !== "string" ||
    !description.trim() ||
    typeof severity !== "string" ||
    !severity.trim()
  ) {
    return "Title, description and severity are required";
  }

  if (!allowedSeverities.includes(severity.trim().toUpperCase())) {
    return "Invalid severity";
  }

  if (
    (checks !== undefined &&
      (!Array.isArray(checks) ||
        !checks.every((item) => typeof item === "string"))) ||
    (actions !== undefined &&
      (!Array.isArray(actions) ||
        !actions.every((item) => typeof item === "string")))
  ) {
    return "Checks and actions must be arrays of strings";
  }

  return null;
}

function getAlertData(body) {
  const severity = body.severity.trim().toUpperCase();

  return {
    title: body.title.trim(),
    description: body.description.trim(),
    severity,
    severityClass: getSeverityClass(severity),
    notification: body.notification,
    escalation: body.escalation,
    checks: body.checks,
    actions: body.actions,
  };
}

function isInvalidId(id) {
  return !id || !mongoose.isValidObjectId(id);
}

// GET /api/alerts
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ active: true })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    console.error("Get alerts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch alerts",
    });
  }
};

// GET /api/alerts/:id
const getAlertById = async (req, res) => {
  try {
    if (isInvalidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID",
      });
    }

    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    console.error("Get alert by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch alert",
    });
  }
};

// POST /api/alerts
const createAlert = async (req, res) => {
  const validationError = validateAlertBody(req.body);

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  let session;

  try {
    session = await mongoose.startSession();

    let alert;

    await session.withTransaction(async () => {
      const [createdAlert] = await Alert.create(
        [getAlertData(req.body)],
        { session }
      );

      await AlertActivity.create(
        [
          {
            alertId: createdAlert._id,
            alertTitle: createdAlert.title,
            action: "CREATED",
            description: `Alert "${createdAlert.title}" was created.`,
          },
        ],
        { session }
      );

      alert = createdAlert;
    });

    return res.status(201).json({
      success: true,
      message: "Alert created successfully",
      data: alert,
    });
  } catch (error) {
    console.error("Create alert error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid alert data",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create alert",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

// PUT /api/alerts/:id
const updateAlert = async (req, res) => {
  const { id } = req.params;

  if (isInvalidId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid alert ID",
    });
  }

  const validationError = validateAlertBody(req.body);

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  let session;

  try {
    session = await mongoose.startSession();

    let alert;

    await session.withTransaction(async () => {
      const updatedAlert = await Alert.findByIdAndUpdate(
        id,
        getAlertData(req.body),
        {
          new: true,
          runValidators: true,
          session,
        }
      );

      if (!updatedAlert) {
        return;
      }

      await AlertActivity.create(
        [
          {
            alertId: updatedAlert._id,
            alertTitle: updatedAlert.title,
            action: "UPDATED",
            description: `Alert "${updatedAlert.title}" was updated.`,
          },
        ],
        { session }
      );

      alert = updatedAlert;
    });

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

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID or alert data",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update alert",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

// GET /api/alerts/:id/activity
const getAlertActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (isInvalidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID",
      });
    }

    const activities = await AlertActivity.find({
      alertId: id,
    }).sort({ createdAt: -1 });

    if (activities.length > 0) {
      return res.status(200).json({
        success: true,
        count: activities.length,
        data: activities,
      });
    }

    const alert = await Alert.findById(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert and its activity history were not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: 0,
      data: [],
    });
  } catch (error) {
    console.error("Get alert activity error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch alert activity",
    });
  }
};

// GET: Fetch the latest 10 activity records
const getRecentActivity = async (req, res) => {
  try {
    const activities = await AlertActivity.find()
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error("Get recent activity error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent activity",
    });
  }
};

// DELETE /api/alerts/:id
const deleteAlert = async (req, res) => {
  const { id } = req.params;

  if (isInvalidId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid alert ID",
    });
  }

  let session;

  try {
    session = await mongoose.startSession();

    let deletedAlert;

    await session.withTransaction(async () => {
      const alert = await Alert.findById(id).session(session);

      if (!alert) {
        return;
      }

      await AlertActivity.create(
        [
          {
            alertId: alert._id,
            alertTitle: alert.title,
            action: "DELETED",
            description: `Alert "${alert.title}" was permanently deleted.`,
          },
        ],
        { session }
      );

      await Alert.deleteOne({ _id: alert._id }, { session });

      deletedAlert = alert;
    });

    if (!deletedAlert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Alert permanently deleted",
      data: deletedAlert,
    });
  } catch (error) {
    console.error("Delete alert error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete alert",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};


const getActivitySummary = async (req, res) => {
  try {
    const results = await AlertActivity.aggregate([
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = {
      created: 0,
      updated: 0,
      deleted: 0,
      total: 0,
    };

    for (const item of results) {
      if (item._id === "CREATED") {
        summary.created = item.count;
      } else if (item._id === "UPDATED") {
        summary.updated = item.count;
      } else if (item._id === "DELETED") {
        summary.deleted = item.count;
      }
    }

    summary.total =
      summary.created + summary.updated + summary.deleted;

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Get activity summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch activity summary",
    });
  }
};


module.exports = {
  getAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  getAlertActivity,
  getActivitySummary,
  getRecentActivity,
  deleteAlert,
};
