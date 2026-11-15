const router = require("express").Router();
const ctrl = require("../controllers/workout.controller");

// TODO: once middleware/auth.middleware.js lands, add:
//   const { protect } = require("../middleware/auth.middleware");
//   router.use(protect);

router.route("/").post(ctrl.create).get(ctrl.list);
router.route("/:id").get(ctrl.getOne).put(ctrl.update).delete(ctrl.remove);

module.exports = router;
