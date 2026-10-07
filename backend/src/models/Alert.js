const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    severity: {
      type: String,
      required: true,
      enum: [
        "CRITICAL",
        "HIGH",
        "MEDIUM",
        "LOW",
        "INFORMATIONAL",
      ],
    },

    severityClass: {
      type: String,
      required: true,
    },

    notification: {
      type: String,
      default: "Based on approved criteria",
    },

    escalation: {
      type: String,
      default: "If required",
    },

    checks: {
      type: [String],
      default: [],
    },

    actions: {
      type: [String],
      default: [],
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alert", alertSchema);