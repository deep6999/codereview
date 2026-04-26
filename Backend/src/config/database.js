const mongoose = require("mongoose");

let connectionPromise = null;
let listenersRegistered = false;

function getDatabaseStatus() {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return states[mongoose.connection.readyState] || "unknown";
}

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

function logDatabaseStatus(prefix) {
  console.log(`[MongoDB] ${prefix}. Status: ${getDatabaseStatus()}`);
}

function registerConnectionListeners() {
  if (listenersRegistered) return;

  listenersRegistered = true;

  mongoose.connection.on("connected", () => {
    logDatabaseStatus("Connected");
  });

  mongoose.connection.on("error", (error) => {
    console.error(`[MongoDB] Connection error: ${error.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    logDatabaseStatus("Disconnected");
  });
}

async function connectToDatabase() {
  registerConnectionListeners();

  if (isDatabaseConnected()) {
    logDatabaseStatus("Connection reuse");
    return mongoose.connection;
  }

  if (connectionPromise) {
    logDatabaseStatus("Connection attempt already in progress");
    return connectionPromise;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("[MongoDB] Missing MONGODB_URI in backend environment.");
    return null;
  }

  logDatabaseStatus("Attempting connection");

  connectionPromise = mongoose
    .connect(mongoUri)
    .then(() => mongoose.connection)
    .catch((error) => {
      console.error(`[MongoDB] Initial connection failed: ${error.message}`);
      return null;
    })
    .finally(() => {
      connectionPromise = null;
    });

  return connectionPromise;
}

module.exports = {
  connectToDatabase,
  getDatabaseStatus,
  isDatabaseConnected,
  logDatabaseStatus,
};
