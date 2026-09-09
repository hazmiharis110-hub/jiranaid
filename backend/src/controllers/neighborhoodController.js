const pool = require("../config/db");

const normalizeNeighborhood = (neighborhood) => ({
  id: neighborhood.id,
  name: neighborhood.name,
  city: neighborhood.city,
  postcode: neighborhood.postcode,
});

// GET all neighborhoods
exports.getAllNeighborhoods = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM neighborhoods");
    res.status(200).json(result.rows.map(normalizeNeighborhood));
  } catch (error) {
    next(error);
  }
};

// 2. INSERT a new neighborhood
exports.insertNeighborhood = async (req, res, next) => {
  try {
    const { name, city, postcode } = req.body;

    // Optional: basic validation
    if (!name || !city || !postcode) {
      return res.status(400).json({
        message: "Name, city, and postcode are required",
      });
    }

    const result = await pool.query(
      "INSERT INTO neighborhoods (name, city, postcode) VALUES ($1, $2, $3) RETURNING *",
      [name, city, postcode],
    );

    res.status(201).json(normalizeNeighborhood(result.rows[0]));
  } catch (error) {
    next(error);
  }
};
