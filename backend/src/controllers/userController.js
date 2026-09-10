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
      neighborhood_id,
      neighbor_id,
      neighborhoodId,
    } = req.body;

    // Safely parse neighborhood ID as integer or null
    const rawId = neighborhood_id || neighbor_id || neighborhoodId;
    const parsedId = parseInt(rawId, 10);
    const resolvedNeighborhoodId = !isNaN(parsedId) ? parsedId : null;

    // Safely parse role as integer (defaults to 1 if not provided or invalid)
    const parsedRole = parseInt(role, 10);
    const resolvedRole = !isNaN(parsedRole) ? parsedRole : 1;

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
      `INSERT INTO users (name, email, password_hash, phone, role, neighborhood_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, phone, role, neighborhood_id AS "neighborhoodId", created_at, updated_at`,
      [
        name,
        normalizedEmail,
        passwordHash,
        phone,
        resolvedRole, // Pass integer role instead of string "user"
        resolvedNeighborhoodId,
      ],
    );

    const newUser = {
      ...result.rows[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(result.rows[0].name)}`,
    };
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
    const { email, password } = req.body || {};

    if (typeof email !== "string") {
      return res.status(400).json({ message: "email is required" });
    }

    // Join neighborhoods to get neighborhoodName and postcode
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.password_hash, u.phone, u.role, 
              u.neighborhood_id AS "neighborhoodId", u.created_at, u.updated_at,
              n.name AS "neighborhoodName", n.postcode
       FROM users u
       LEFT JOIN neighborhoods n ON u.neighborhood_id = n.id
       WHERE u.email = $1`,
      [email.trim().toLowerCase()],
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password if provided
    if (password) {
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      neighborhoodId: user.neighborhoodId,
      neighborhoodName: user.neighborhoodName || "Local Circle",
      postcode: user.postcode || "53100",
      avatar:
        user.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
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
    const { verifyAccessToken } = require("../config/auth");
    const authHeader = req.headers.authorization || "";
    const parts = authHeader.split(/\s+/);
    const scheme = parts[0];
    const token = parts[1];

    if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
      return res.json({ success: true, user: null });
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      return res.json({ success: true, user: null });
    }

    const userId = payload.sub || payload.id;
    if (!userId) {
      return res.json({ success: true, user: null });
    }

    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.phone, u.role, 
              u.neighborhood_id AS "neighborhoodId", u.created_at, u.updated_at,
              n.name AS "neighborhoodName", n.postcode
       FROM users u
       LEFT JOIN neighborhoods n ON u.neighborhood_id = n.id
       WHERE u.id = $1`,
      [userId],
    );

    const user = result.rows[0] || null;
    if (user) {
      user.avatar =
        user.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;
      user.neighborhoodName = user.neighborhoodName || "Local Circle";
      user.postcode = user.postcode || "53100";
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: true, user: null });
  }
};

exports.switchUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    // FIX: Changed neighbor_id to neighborhood_id
    const result = await pool.query(
      `SELECT id, name, email, phone, role, neighborhood_id AS "neighborhoodId", created_at, updated_at
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
    // FIX: Changed neighbor_id to neighborhood_id
    const result = await pool.query(
      `SELECT id, name, email, phone, role, neighborhood_id AS "neighborhoodId", created_at, updated_at FROM users LIMIT 1`,
    );
    res.json({ success: true, user: result.rows[0] || null });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};
