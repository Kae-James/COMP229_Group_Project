const Workout = require("../models/workout.model");
const crud = require("./crud.factory");

module.exports = crud(Workout);
