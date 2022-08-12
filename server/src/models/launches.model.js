const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("September 26, 2030"),
  destination: "Kepler-442 b",
  customer: ["NASA", "Source"],
  upcoming: true,
  success: false,
};

const launches = new Map();
launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

module.exports = {
  getAllLaunches,
};
