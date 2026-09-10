const pool = require("../config/db");

// Create a booking
const createBooking = async (req, res) => {
  try {
    const { item_id, user_id, start_date, end_date, total_price } = req.body;

    // Validate required fields
    if (
      !item_id ||
      !user_id ||
      !start_date ||
      !end_date ||
      total_price === undefined
    ) {
      return res.status(400).json({
        message: "All booking fields are required",
      });
    }

    // Validate dates
    if (new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({
        message: "End date must be after start date",
      });
    }

    // Validate total price
    if (total_price < 0) {
      return res.status(400).json({
        message: "Total price cannot be negative",
      });
    }

    // Check if item exists
    const itemResult = await pool.query(
      `SELECT id FROM items
    WHERE id = $1`,
      [item_id],
    );

    if (itemResult.rows.length === 0) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    // Check if user exists
    const userResult = await pool.query(
      `SELECT id FROM users
    WHERE id = $1`,
      [user_id],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const result = await pool.query(
      `INSERT INTO bookings
            (item_id, user_id, start_date, end_date, total_price)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
      [item_id, user_id, start_date, end_date, total_price],
    );

    res.status(201).json({
      message: "Booking created successfully",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create booking",
    });
  }
};

// Get all bookings
const getBookings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
  b.id,
  b.item_id,
  b.user_id AS borrower_id,
  b.start_date,
  b.end_date,
  b.total_price,
  b.status,
  b.created_at,
  b.updated_at,

  i.title AS tool_title,
  i.image_url AS tool_image,
  i.category AS tool_category,
  i.price AS maintenance_fee,
  i.deposit AS deposit_fee,
  i.user_id AS owner_id,

  COALESCE(owner.name, 'Unknown Owner') AS owner_name,
  COALESCE(borrower.name, 'Unknown Borrower') AS borrower_name

FROM bookings b

LEFT JOIN items i 
  ON b.item_id = i.id

LEFT JOIN users owner 
  ON i.user_id = owner.id

LEFT JOIN users borrower 
  ON b.user_id = borrower.id

ORDER BY b.created_at DESC;`,
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get bookings",
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM bookings
             WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get booking",
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE bookings
             SET status = 'cancelled',
                 updated_at = NOW()
             WHERE id = $1
             RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
};

const declineBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE bookings
             SET status = 'declined',
                 updated_at = NOW()
             WHERE id = $1
             RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json({
      message: "Booking declined successfully",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to decline booking",
    });
  }
};

const approvedBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE bookings
             SET status = 'approved',
                 updated_at = NOW()
             WHERE id = $1
             RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json({
      message: "Booking approved successfully",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to approve booking",
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  declineBooking,
  approvedBooking,
};
