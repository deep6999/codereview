require("dotenv").config();
const app = require("./src/app");
const {
  connectToDatabase,
  logDatabaseStatus,
} = require("./src/config/database");

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    logDatabaseStatus("Startup check");
  });

  await connectToDatabase();
}

startServer().catch((error) => {
  console.error("Unexpected startup error:", error);
});
