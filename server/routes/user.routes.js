const router = require("express").Router();
const ctrl = require("../controllers/user.controller");


const { protect, adminOnly } = require("../middleware/auth.middleware");

router.use(protect);

router.route("/").get(adminOnly, ctrl.list);

router
  .route("/:id")
  .get(ctrl.getOne)
  .put(ctrl.update)
  .delete(adminOnly, ctrl.remove);
router.route("/").get(/* adminOnly, */ ctrl.list);
router
  .route("/:id")
  .get(ctrl.getOne)
  .put(ctrl.update)
  .delete(/* adminOnly, */ ctrl.remove);

module.exports = router;
