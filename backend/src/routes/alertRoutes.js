const express = require("express");

const router = express.Router();

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

module.exports = router;