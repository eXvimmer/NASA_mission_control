const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;
const MONGO_URL = "mongodb://127.0.0.1:27017/";
const DB_NAME = "nasa";

const server = http.createServer(app);

mongoose.connection.once("open", () =>
  console.log("✅ MongoDB Connection is Ready!")
);

mongoose.connection.on("error", (err) => {
  console.error(`❌ ${err}`);
});

async function startServer() {
  mongoose.connect(MONGO_URL + DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`🚀 server is running on http://127.0.0.1:${PORT}/`);
  });
}

startServer();
