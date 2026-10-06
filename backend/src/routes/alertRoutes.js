const express = require("express");

const router = express.Router();

function getSeverityClass(severity) {
  const normalizedSeverity = severity.toUpperCase();

  if (normalizedSeverity === "CRITICAL") {
    return "critical";
  }

  if (normalizedSeverity === "HIGH") {
    return "high";
  }

  if (normalizedSeverity === "MEDIUM") {
    return "medium";
  }

  if (normalizedSeverity === "LOW") {
    return "low";
  }

  return "informational";
}

const alertProcedures = [
  {
    id: 1,
    title: "DEVICE DOWN",
    description: "Network device is unavailable or not responding.",
    severity: "CRITICAL",
    severityClass: "critical",
    notification: "REQUIRED",
    escalation: "REQUIRED",
  },
  {
    id: 2,
    title: "BGP NEIGHBOR DOWN",
    description: "BGP peering session is down.",
    severity: "CRITICAL",
    severityClass: "critical",
    notification: "Based on approved criteria",
    escalation: "REQUIRED",
  },
  {
    id: 3,
    title: "INTERFACE DOWN",
    description: "Network interface is reported down.",
    severity: "HIGH",
    severityClass: "high",
    notification: "Based on alert criteria",
    escalation: "If required",
  },
  {
    id: 4,
    title: "PACKET LOSS",
    description: "Packet loss detected above the configured threshold.",
    severity: "HIGH",
    severityClass: "high",
    notification: "Based on threshold/SLA",
    escalation: "If persistent",
  },
  {
    id: 5,
    title: "HIGH CPU",
    description: "CPU utilization exceeded the configured threshold.",
    severity: "MEDIUM",
    severityClass: "medium",
    notification: "Based on approved criteria",
    escalation: "If persistent",
  },
  {
    id: 6,
    title: "HIGH MEMORY",
    description: "Memory utilization exceeded the configured threshold.",
    severity: "MEDIUM",
    severityClass: "medium",
    notification: "Based on approved criteria",
    escalation: "If persistent",
  },
  {
    id: 7,
    title: "INTERFACE FLAPPING",
    description: "Interface repeatedly changes between up and down.",
    severity: "MEDIUM/HIGH",
    severityClass: "medium",
    notification: "Based on defined criteria",
    escalation: "If persistent",
  },
  {
    id: 8,
    title: "DEVICE RECOVERED",
    description: "Previously triggered alert has cleared and device is responding.",
    severity: "INFORMATIONAL",
    severityClass: "low",
    notification: "According to recovery policy",
    escalation: "Usually not required",
  },
];

router.get("/", (req, res) => {
  res.json({
    success: true,
    count: alertProcedures.length,
    data: alertProcedures,
  });
});

router.post("/", (req, res) => {
  const {
    title,
    description,
    severity,
    notification,
    escalation,
  } = req.body;

  if (!title || !description || !severity) {
    return res.status(400).json({
      success: false,
      message: "Title, description and severity are required.",
    });
  }

  const newAlert = {
    id: Date.now(),
    title: title.toUpperCase(),
    description,
    severity: severity.toUpperCase(),
    severityClass: getSeverityClass(severity),
    notification: notification || "Based on approved criteria",
    escalation: escalation || "If required",
  };

  alertProcedures.push(newAlert);

  res.status(201).json({
    success: true,
    message: "Alert procedure created successfully.",
    data: newAlert,
  });
});

module.exports = router;