const http = require("http");
const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");
const { mongoConnect } = require("./services/mongo");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  mongoConnect();
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`🚀 server is running on http://127.0.0.1:${PORT}/`);
  });
}

startServer();
// https://api.spacexdata.com/v5/launches/latest
