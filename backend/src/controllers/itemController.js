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
  owner_name: item.owner_name || "Neighbor",
  avg_rating: item.avg_rating || 0.0,
});

// GET all items (using a safe subquery or clean left join to prevent dropping un-reviewed items)
exports.getAllItems = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT i.id, i.title, i.description, i.price, i.deposit, i.category, i.image_url, i.user_id, 
              owner.name AS owner_name, 
              COALESCE(sub.avg_rating, 0.0) AS avg_rating 
       FROM items i 
       JOIN users owner ON i.user_id = owner.id 
       LEFT JOIN (
           SELECT b.item_id, ROUND(AVG(r.rating), 1) AS avg_rating 
           FROM bookings b 
           JOIN reviews r ON r.booking_id = b.id 
           GROUP BY b.item_id
       ) sub ON sub.item_id = i.id 
       ORDER BY i.id DESC`,
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
    const result = await pool.query(
      `SELECT i.*, owner.name AS owner_name 
       FROM items i 
       JOIN users owner ON i.user_id = owner.id 
       WHERE i.id = $1`,
      [id],
    );

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

    // Fetch owner name for the newly inserted item response mapping
    const userResult = await pool.query(
      "SELECT name FROM users WHERE id = $1",
      [req.user.id],
    );
    const newItem = {
      ...result.rows[0],
      owner_name: userResult.rows[0]?.name || "Neighbor",
    };

    res.status(201).json(normalizeItem(newItem));
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

    const userResult = await pool.query(
      "SELECT name FROM users WHERE id = $1",
      [result.rows[0].user_id],
    );
    const updatedItem = {
      ...result.rows[0],
      owner_name: userResult.rows[0]?.name || "Neighbor",
    };

    res.status(200).json(normalizeItem(updatedItem));
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

module.exports = exports;
