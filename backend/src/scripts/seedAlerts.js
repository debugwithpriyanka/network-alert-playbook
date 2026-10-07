require("dotenv").config();

const connectDB = require("../config/db");
const Alert = require("../models/Alert");
const alertData = require("../data/alertData");

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

const seedAlerts = async () => {
  try {
    await connectDB();

    await Alert.deleteMany();

    const preparedAlerts = alertData.map((alert) => ({
      ...alert,
      severityClass: getSeverityClass(alert.severity),
    }));

    await Alert.insertMany(preparedAlerts);

    console.log(
      `${preparedAlerts.length} alerts inserted successfully`
    );

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedAlerts();