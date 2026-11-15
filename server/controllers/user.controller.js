const User = require("../models/user.model");
const { requireUser } = require("./crud.factory");

// Requires req.user = { id, role }, set by protect in middleware/auth.middleware.js.
// Admin checks are repeated here so these routes stay closed even before
// adminOnly is wired into routes/user.routes.js.
const isAdmin = (req) => req.user.role === "admin";
const isSelfOrAdmin = (req) => req.user.id === req.params.id || isAdmin(req);

// GET /api/users (admin)
exports.list = requireUser(async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ message: "Admin access required" });
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

// GET /api/users/:id (owner or admin)
exports.getOne = requireUser(async (req, res) => {
  if (!isSelfOrAdmin(req)) return res.status(403).json({ message: "Forbidden" });
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// PUT /api/users/:id (owner or admin)
// Only name and email can change here; only an admin may change role.
// Password changes belong to the auth flow so they get hashed.
exports.update = requireUser(async (req, res) => {
  if (!isSelfOrAdmin(req)) return res.status(403).json({ message: "Forbidden" });
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, email, role } = req.body || {};
  if (role !== undefined && !isAdmin(req)) {
    return res.status(403).json({ message: "Only an admin can change roles" });
  }
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (role !== undefined) user.role = role;

  await user.save();
  res.json(user);
});

// DELETE /api/users/:id (admin)
exports.remove = requireUser(async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ message: "Admin access required" });
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted", id: user._id });
});
