// Shared CRUD handlers for owner-scoped records (workouts, sleep, meals, goals).
// Requires req.user = { id, role }, set by protect in middleware/auth.middleware.js.

const withoutOwner = (body = {}) => {
  const { owner, _id, ...rest } = body;
  return rest;
};

// Loads the record and checks the signed-in user owns it.
// Sends 404/403 and returns null if not.
const findOwned = async (Model, req, res) => {
  const doc = await Model.findById(req.params.id);
  if (!doc) {
    res.status(404).json({ message: "Record not found" });
    return null;
  }
  if (doc.owner.toString() !== req.user.id) {
    res.status(403).json({ message: "Forbidden" });
    return null;
  }
  return doc;
};

// Fail closed: if protect hasn't set req.user, reject instead of crashing.
const requireUser = (handler) => (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  return handler(req, res, next);
};

const handlers = (Model) => ({
  create: async (req, res) => {
    const doc = await Model.create({ ...withoutOwner(req.body), owner: req.user.id });
    res.status(201).json(doc);
  },

  list: async (req, res) => {
    const docs = await Model.find({ owner: req.user.id }).sort({ date: -1 });
    res.json(docs);
  },

  getOne: async (req, res) => {
    const doc = await findOwned(Model, req, res);
    if (doc) res.json(doc);
  },

  update: async (req, res) => {
    const doc = await findOwned(Model, req, res);
    if (!doc) return;
    doc.set(withoutOwner(req.body));
    await doc.save(); // runs schema validators
    res.json(doc);
  },

  remove: async (req, res) => {
    const doc = await findOwned(Model, req, res);
    if (!doc) return;
    await doc.deleteOne();
    res.json({ message: "Record deleted", id: doc._id });
  },
});

module.exports = (Model) =>
  Object.fromEntries(
    Object.entries(handlers(Model)).map(([name, fn]) => [name, requireUser(fn)])
  );

module.exports.requireUser = requireUser;
