const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI, {
  family: 4,
});

let db;

const connectDB = async () => {
  try {
    await client.connect();

    db = client.db("network_alert_playbook");

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;