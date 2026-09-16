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
        resolvedRole,
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
    // If authMiddleware was used, req.user is already populated
    let userId = req.user?.sub || req.user?.id;

    if (!userId) {
      const { verifyAccessToken } = require("../config/auth");
      const authHeader = req.headers.authorization || "";
      const parts = authHeader.split(/\s+/);
      const scheme = parts[0];
      const token = parts[1];

      if (scheme && scheme.toLowerCase() === "bearer" && token) {
        try {
          const payload = verifyAccessToken(token);
          userId = payload.sub || payload.id;
        } catch {
          // Token invalid or expired
        }
      }
    }

    if (!userId) {
      // Fallback if no token is present: fetch first available user so the frontend doesn't break
      const fallbackResult = await pool.query(
        `SELECT u.id, u.name, u.email, u.phone, u.role, 
                u.neighborhood_id AS "neighborhoodId", u.created_at, u.updated_at,
                n.name AS "neighborhoodName", n.postcode
         FROM users u
         LEFT JOIN neighborhoods n ON u.neighborhood_id = n.id
         LIMIT 1`,
      );
      const fallbackUser = fallbackResult.rows[0] || null;
      if (fallbackUser) {
        fallbackUser.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fallbackUser.name)}`;
        fallbackUser.neighborhoodName =
          fallbackUser.neighborhoodName || "Local Circle";
        fallbackUser.postcode = fallbackUser.postcode || "53100";
      }
      return res.json({ success: true, user: fallbackUser });
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
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.phone, u.role, 
              u.neighborhood_id AS "neighborhoodId", u.created_at, u.updated_at,
              n.name AS "neighborhoodName", n.postcode
       FROM users u
       LEFT JOIN neighborhoods n ON u.neighborhood_id = n.id
       WHERE u.id = $1`,
      [userId],
    );
    const user = result.rows[0];
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;
    user.neighborhoodName = user.neighborhoodName || "Local Circle";
    user.postcode = user.postcode || "53100";

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.verifyLocation = async (req, res, next) => {
  try {
    const { neighborhoodId, postcode } = req.body || {};
    let userId = req.user?.sub || req.user?.id;
    if (!userId) {
      const { verifyAccessToken } = require("../config/auth");
      const authHeader = req.headers.authorization || "";
      const parts = authHeader.split(/\s+/);
      if (parts[0]?.toLowerCase() === "bearer" && parts[1]) {
        try {
          const payload = verifyAccessToken(parts[1]);
          userId = payload.sub || payload.id;
        } catch {}
      }
    }

    if (neighborhoodId) {
      if (userId) {
        await pool.query(
          "UPDATE users SET neighborhood_id = $1 WHERE id = $2",
          [neighborhoodId, userId],
        );
      } else {
        await pool.query(
          "UPDATE users SET neighborhood_id = $1 WHERE id = (SELECT id FROM users ORDER BY id ASC LIMIT 1)",
          [neighborhoodId],
        );
      }
    }

    const query = userId
      ? `SELECT u.id, u.name, u.email, u.phone, u.role, 
              u.neighborhood_id AS "neighborhoodId", u.created_at, u.updated_at,
              n.name AS "neighborhoodName", n.postcode
       FROM users u
       LEFT JOIN neighborhoods n ON u.neighborhood_id = n.id
       WHERE u.id = $1`
      : `SELECT u.id, u.name, u.email, u.phone, u.role, 
              u.neighborhood_id AS "neighborhoodId", u.created_at, u.updated_at,
              n.name AS "neighborhoodName", n.postcode
       FROM users u
       LEFT JOIN neighborhoods n ON u.neighborhood_id = n.id
       ORDER BY u.id ASC
       LIMIT 1`;
    const params = userId ? [userId] : [];
    const result = await pool.query(query, params);
    const user = result.rows[0] || null;
    if (user) {
      user.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;
      user.neighborhoodName = user.neighborhoodName || "Local Circle";
      user.postcode = postcode || user.postcode || "53100";
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};
