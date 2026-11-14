const Meal = require("../models/meal.model");
const crud = require("./crud.factory");

module.exports = crud(Meal);
