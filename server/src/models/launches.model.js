const axios = require("axios");
const Launch = require("./launches.mongo");
const Planet = require("./planets.mongo");

let DEFAULT_FLIGHT_NUMBER = 100;

async function findLaunch(filter) {
  return await Launch.findOne(filter);
}

async function existsLaunchWithId(id) {
  const launch = await findLaunch({ flightNumber: id });
  return !!launch;
}

async function getLatestFlightNumber() {
  const latestLaunch = await Launch.findOne().sort("-flightNumber");
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
  return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  return await Launch.find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch) {
  await Launch.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const planet = await Planet.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error("no matching planet found");
  }

  const newLaunch = Object.assign(launch, {
    customer: ["NASA", "Source"], // TODO: add customers dynamically
    upcoming: true,
    success: true,
    flightNumber: (await getLatestFlightNumber()) + 1,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(id) {
  const aborted = await Launch.findOneAndUpdate(
    {
      flightNumber: id,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return !!aborted;
}

const SPACEX_API = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log(`Downloading data from API...`);
  const response = await axios.post(SPACEX_API, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log(`Problem downloading launch data`);
    throw new Error("launch data download failed");
  }

  const launchDocs = response.data.docs;

  for (let launchDoc of launchDocs) {
    const {
      flight_number,
      success,
      upcoming,
      name,
      rocket,
      date_local,
      payloads,
    } = launchDoc;
    const customers = payloads.flatMap((payload) => payload["customers"]);

    const launch = {
      flightNumber: flight_number,
      success,
      upcoming,
      mission: name,
      rocket: rocket.name,
      launchDate: date_local,
      customers,
    };

    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    mission: "FalconSat",
    rocket: "Falcon 1",
  });

  if (firstLaunch) {
    console.log(`✅ launch data has already been loaded`);
    return;
  }

  await populateLaunches();
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  loadLaunchData,
};
