const { verifyAccessToken } = require("../config/auth");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const parts = authHeader.split(/\s+/); // Handles spaces or unexpected line breaks safely
  const scheme = parts[0];
  const token = parts[1];

  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Bearer token is missing or malformed" });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
