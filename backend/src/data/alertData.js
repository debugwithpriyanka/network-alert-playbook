const alertData = [
  {
    title: "DEVICE DOWN",
    description:
      "Network device is unavailable or not responding.",
    severity: "CRITICAL",
    notification: "REQUIRED",
    escalation: "REQUIRED",

    checks: [
      "Confirm the alert is active",
      "Check last successful communication",
      "Perform approved reachability check",
      "Check related alerts",
      "Check known maintenance activity",
    ],

    actions: [
      "Validate the alert",
      "Perform initial checks",
      "Follow notification criteria",
      "Notify customer if required",
      "Escalate to L2 according to escalation matrix",
      "Update the incident",
      "Track until resolution",
    ],
  },

  {
    title: "BGP NEIGHBOR DOWN",
    description:
      "BGP peering session is down.",
    severity: "CRITICAL",
    notification: "Based on approved criteria",
    escalation: "REQUIRED",

    checks: [
      "Confirm BGP alert",
      "Check neighbor status",
      "Check interface status",
      "Check related routing alerts",
      "Check maintenance activity",
    ],

    actions: [
      "Validate the BGP alert",
      "Perform initial connectivity checks",
      "Follow notification criteria",
      "Notify customer if required",
      "Escalate to L2",
      "Update the incident",
      "Track until resolution",
    ],
  },

  {
    title: "INTERFACE DOWN",
    description:
      "Network interface is reported down.",
    severity: "HIGH",
    notification: "Based on alert criteria",
    escalation: "If required",
  },

  {
    title: "PACKET LOSS",
    description:
      "Packet loss detected above the configured threshold.",
    severity: "HIGH",
    notification: "Based on threshold/SLA",
    escalation: "If persistent",
  },

  {
    title: "HIGH CPU",
    description:
      "CPU utilization exceeded the configured threshold.",
    severity: "MEDIUM",
    notification: "Based on approved criteria",
    escalation: "If persistent",
  },

  {
    title: "HIGH MEMORY",
    description:
      "Memory utilization exceeded the configured threshold.",
    severity: "MEDIUM",
    notification: "Based on approved criteria",
    escalation: "If persistent",
  },

  {
    title: "INTERFACE FLAPPING",
    description:
      "Interface repeatedly changes between up and down.",
    severity: "MEDIUM",
    notification: "Based on defined criteria",
    escalation: "If persistent",
  },

  {
    title: "DEVICE RECOVERED",
    description:
      "Previously triggered alert has cleared and device is responding.",
    severity: "INFORMATIONAL",
    notification: "According to recovery policy",
    escalation: "Usually not required",
  },
];

module.exports = alertData;