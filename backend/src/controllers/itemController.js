const pool = require("../config/db");

const normalizeItem = (item) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  price: item.price,
  deposit: item.deposit,
  category: item.category,
  image_url: item.image_url,
  pickup_note: item.pickup_note,
  user_id: item.user_id,
  ownerId: item.user_id, // Added for full frontend compatibility
  owner_name: item.owner_name || "Neighbor",
  avg_rating: item.avg_rating || 0.0,
});

exports.getAllItems = async (req, res, next) => {
  try {
    const { category, search, status } = req.query;

    let queryText = `
      SELECT i.id, i.title, i.description, i.price, i.deposit, i.category, i.image_url, i.pickup_note, i.user_id, 
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
      WHERE 1=1
    `;

    const queryParams = [];

    // Filter by category
    if (category && category !== "All") {
      queryParams.push(category);
      queryText += ` AND i.category = $${queryParams.length}`;
    }

    // Filter by search query (title or description)
    if (search) {
      queryParams.push(`%${search}%`);
      queryText += ` AND (i.title ILIKE $${queryParams.length} OR i.description ILIKE $${queryParams.length})`;
    }

    // Filter by status if items table contains status column
    if (status && status !== "all") {
      queryParams.push(status);
      queryText += ` AND i.status = $${queryParams.length}`;
    }

    queryText += ` ORDER BY i.id DESC`;

    const result = await pool.query(queryText, queryParams);
    res.status(200).json(result.rows.map(normalizeItem));
  } catch (error) {
    next(error);
  }
};

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

exports.insertItem = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      deposit,
      category,
      image_url,
      pickup_note,
    } = req.body;

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
      "INSERT INTO items (title, description, price, deposit, category, image_url, pickup_note, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        title,
        description,
        price,
        deposit,
        category,
        image_url,
        pickup_note,
        req.user.id,
      ],
    );

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

exports.updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      maintenanceFeePerDay,
      deposit,
      depositAmount,
      category,
      image_url,
      pickupNote,
    } = req.body;

    const finalPrice =
      maintenanceFeePerDay !== undefined ? maintenanceFeePerDay : price;
    const finalDeposit = depositAmount !== undefined ? depositAmount : deposit;

    const result = await pool.query(
      `UPDATE items 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           price = COALESCE($3, price), 
           deposit = COALESCE($4, deposit), 
           category = COALESCE($5, category), 
           image_url = COALESCE($6, image_url),
           pickup_note = COALESCE($7, pickup_note)
       WHERE id = $8 RETURNING *`,
      [
        title,
        description,
        finalPrice,
        finalDeposit,
        category,
        image_url,
        pickupNote,
        id,
      ],
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
