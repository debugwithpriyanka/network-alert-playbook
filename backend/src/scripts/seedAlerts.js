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

    const preparedAlerts = alertData.map((alert) => ({
      ...alert,
      severityClass: getSeverityClass(alert.severity),
    }));

    let insertedCount = 0;

    for (const alert of preparedAlerts) {
      const result = await Alert.updateOne(
        { title: alert.title },
        { $setOnInsert: alert },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        insertedCount++;
      }
    }

    console.log(
      `Seed completed. ${insertedCount} new default alerts inserted.`
    );

    console.log("Existing alerts were preserved.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedAlerts();
