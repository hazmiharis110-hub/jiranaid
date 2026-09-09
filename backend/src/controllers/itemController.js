const pool = require("../config/db");

const normalizeItem = (item) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  price: item.price,
  deposit: item.deposit,
  category: item.category,
  image_url: item.image_url,
  user_id: item.user_id,
});

// GET all items
exports.getAllItems = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT i.id, i.title, i.description, i.price, i.deposit, i.category, i.image_url, owner.name AS owner_name, COALESCE(ROUND(AVG(r.rating), 1), 0.0) AS avg_rating FROM items i JOIN users owner ON i.user_id = owner.id LEFT JOIN bookings b ON b.item_id = i.id LEFT JOIN reviews r ON r.booking_id = b.id WHERE owner.neighborhood_id = (SELECT neighborhood_id FROM users WHERE id = $1) GROUP BY i.id, owner.name",
      [req.user.id],
    );
    res.status(200).json(result.rows.map(normalizeItem));
  } catch (error) {
    next(error);
  }
};

// 1. GET a single item by ID
exports.getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM items WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(normalizeItem(result.rows[0]));
  } catch (error) {
    next(error);
  }
};

// 2. INSERT a new item
exports.insertItem = async (req, res, next) => {
  try {
    const { title, description, price, deposit, category, image_url } =
      req.body;

    // Optional: basic validation
    if (
      !title ||
      price === undefined ||
      deposit === undefined ||
      !category ||
      !image_url
    ) {
      return res.status(400).json({
        message: "Title, price, deposit, category, and image_url are required",
      });
    }

    const result = await pool.query(
      "INSERT INTO items (title, description, price, deposit, category, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, description, price, deposit, category, image_url, req.user.id],
    );

    res.status(201).json(normalizeItem(result.rows[0]));
  } catch (error) {
    next(error);
  }
};

// 3. UPDATE an existing item
exports.updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, price, deposit, category, image_url } =
      req.body;

    const result = await pool.query(
      "UPDATE items SET title = $1, description = $2, price = $3, deposit = $4, category = $5, image_url = $6 WHERE id = $7 RETURNING *",
      [title, description, price, deposit, category, image_url, id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Item not found or not authorized" });
    }

    res.status(200).json(normalizeItem(result.rows[0]));
  } catch (error) {
    next(error);
  }
};

// 4. DELETE an item
exports.deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM items WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: `Item ${id} deleted successfully` });
  } catch (error) {
    next(error);
  }
};
