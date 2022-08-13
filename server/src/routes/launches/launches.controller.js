const { getAllLaunches, addNewLaunch } = require("../../models/launches.model");

function httpGetAllLaunches(_req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;
  // TODO: check for validity of req.body
  launch.launchDate = new Date(launch.launchDate);
  addNewLaunch(launch);
  return res.status(201).json(launch);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
};
