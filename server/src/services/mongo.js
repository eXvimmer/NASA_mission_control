const mongoose = require("mongoose");

mongoose.connection.once("open", () =>
  console.log("✅ MongoDB Connection is Ready!")
);

mongoose.connection.on("error", (err) => {
  console.error(`❌ ${err}`);
});

function mongoConnect() {
  mongoose.connect(
    `${process.env.MONGO_URL}:${process.env.MONGO_PORT}/${process.env.DB_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };
