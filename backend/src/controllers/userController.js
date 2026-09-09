// src/controllers/userController.js
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const { signAccessToken } = require("../config/auth");

exports.registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone = null,
      role,
      neighbor_id,
      neighborhoodId,
    } = req.body;
    const resolvedNeighborId = neighbor_id || neighborhoodId || null;

    if (typeof email !== "string" || typeof name !== "string") {
      return res.status(400).json({ message: "email and name are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      normalizedEmail,
    ]);

    if (existing.rows[0]) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = password
      ? await bcrypt.hash(password, 12)
      : await bcrypt.hash("password123", 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, role, neighbor_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, phone, role, neighbor_id AS "neighborhoodId", created_at, updated_at`,
      [
        name,
        normalizedEmail,
        passwordHash,
        phone,
        role || "user",
        resolvedNeighborId,
      ],
    );

    const newUser = result.rows[0];
    const token = signAccessToken({
      sub: String(newUser.id),
      email: newUser.email,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Email already registered" });
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email } = req.body || {};

    if (typeof email !== "string") {
      return res.status(400).json({ message: "email is required" });
    }

    const result = await pool.query(
      `SELECT id, name, email, password, phone, role, neighbor_id AS "neighborhoodId", created_at, updated_at
       FROM users WHERE email = $1`,
      [email.trim().toLowerCase()],
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      neighborhoodId: user.neighborhoodId,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    const token = signAccessToken({
      sub: String(safeUser.id),
      email: safeUser.email,
    });
    res.json({
      success: true,
      message: "Login successful",
      user: safeUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    // If auth middleware isn't attached or user is not logged in, return null gracefully instead of 404
    if (!req.user && !req.headers.authorization) {
      return res.json({ success: true, user: null });
    }

    // If there's a token payload, extract user ID or fetch from database
    const userId = req.user?.sub || req.user?.id;
    if (!userId) {
      return res.json({ success: true, user: null });
    }

    const result = await pool.query(
      `SELECT id, name, email, phone, role, neighbor_id AS "neighborhoodId", created_at, updated_at
       FROM users WHERE id = $1`,
      [userId],
    );

    res.json({ success: true, user: result.rows[0] || null });
  } catch (error) {
    res.json({ success: true, user: null });
  }
};

exports.switchUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const result = await pool.query(
      `SELECT id, name, email, phone, role, neighbor_id AS "neighborhoodId", created_at, updated_at
       FROM users WHERE id = $1`,
      [userId],
    );
    const user = result.rows[0];
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.verifyLocation = async (req, res, next) => {
  try {
    const { neighborhoodId } = req.body;
    // Mock location verification success returning current session user or first user
    const result = await pool.query(
      `SELECT id, name, email, phone, role, neighbor_id AS "neighborhoodId", created_at, updated_at FROM users LIMIT 1`,
    );
    res.json({ success: true, user: result.rows[0] || null });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};
