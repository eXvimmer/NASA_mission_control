const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 server is running on http://127.0.0.1:${PORT}/`);
});
