const planets = require("../../models/planets.model");

function getAllPlanets(_req, res) {
  return res.status(200).json(planets);
}

module.exports = {
  getAllPlanets,
};
