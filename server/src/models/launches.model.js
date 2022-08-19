const Launch = require("./launches.mongo");
const Planet = require("./planets.mongo");

let DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("September 26, 2030"),
  target: "Kepler-442 b",
  customers: ["NASA", "Source"],
  upcoming: true,
  success: true,
};
saveLaunch(launch);

const launches = new Map();

function existsLaunchWithId(id) {
  return launches.has(id);
}

async function getLatestFlightNumber() {
  const latestLaunch = await Launch.findOne().sort("-flightNumber");
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await Launch.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await Planet.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error("no matching planet found");
  }

  await Launch.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

function addNewLaunch(launch) {
  launches.set(
    ++latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customer: ["NASA", "Source"],
      upcoming: true,
      success: true,
    })
  );
}

function abortLaunchById(id) {
  const aborted = launches.get(id);
  aborted.upcoming = false;
  aborted.success = false;

  return aborted;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
