const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/";
const DB_NAME = "nasa";

mongoose.connection.once("open", () =>
  console.log("✅ MongoDB Connection is Ready!")
);

mongoose.connection.on("error", (err) => {
  console.error(`❌ ${err}`);
});

function mongoConnect() {
  mongoose.connect(MONGO_URL + DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };
