const express = require("express");
const { getAllLaunches } = require("./launches.controller");

const router = express.Router();

router.get("/launches", getAllLaunches);

module.exports = router;
