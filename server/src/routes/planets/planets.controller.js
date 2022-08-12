const { getAllPlanets } = require("../../models/planets.model");

function httpGetAllPlanets(_req, res) {
  return res.status(200).json(getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
