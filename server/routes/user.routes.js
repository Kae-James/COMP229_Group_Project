const router = require("express").Router();
const ctrl = require("../controllers/user.controller");

// TODO: once middleware/auth.middleware.js lands, add:
//   const { protect, adminOnly } = require("../middleware/auth.middleware");
//   router.use(protect);
// and put adminOnly before ctrl.list and ctrl.remove.

router.route("/").get(/* adminOnly, */ ctrl.list);
router
  .route("/:id")
  .get(ctrl.getOne)
  .put(ctrl.update)
  .delete(/* adminOnly, */ ctrl.remove);

module.exports = router;
