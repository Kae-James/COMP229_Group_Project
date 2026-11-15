const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createToken = (user) =>
  jwt.sign(
    { id: String(user._id), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

exports.register = async (req, res) => {
  const { name, email, password } = req.body || {};

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof password !== "string" ||
    !password
  ) {
    return res.status(400).json({
      message: "Enter a name, valid email, and password",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(400).json({ message: "Email is already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // New registrations always get the regular-user role.
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "user",
  });

  res.status(201).json({
    token: createToken(user),
    user: publicUser(user),
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Enter your email and password" });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    token: createToken(user),
    user: publicUser(user),
  });
};

exports.logout = (req, res) => {
  res.json({ message: "Logged out" });
};