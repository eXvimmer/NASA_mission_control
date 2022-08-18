const path = require("path");
const fs = require("fs");
const { parse } = require("csv-parse");
const Planet = require("./planets.mongo");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject();
      })
      .on("end", async () => {
        const FoundPlanetsCount = await Planet.count();
        console.log(`${FoundPlanetsCount} habitable planets found!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await Planet.find({}, { _id: 0, __v: 0 });
}

async function savePlanet(planet) {
  try {
    await Planet.updateOne(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true } // add if planet doesn't exist
    );
  } catch (err) {
    console.error(`❌ could save the planet: ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
