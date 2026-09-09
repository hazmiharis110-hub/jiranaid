const pool = require("../config/db");

// Create a review
const createReview = async (req, res) => {
  try {
    const {
      booking_id,
      rating,
      comment
    } = req.body;

    // Validate required fields
    if (!booking_id || rating === undefined) {
    return res.status(400).json({
    message: "Booking ID and rating are required"
    });
    }

    // Validate rating
    if (rating < 0 || rating > 5) {
    return res.status(400).json({
    message: "Rating must be between 0 and 5"
  });
}
    // Check if booking exists
    const bookingResult = await pool.query(
    `SELECT id FROM bookings
    WHERE id = $1`,
    [booking_id]
    );

    if (bookingResult.rows.length === 0) {
    return res.status(404).json({
    message: "Booking not found"
  });
}

    // Check if booking already has a review
    const existingReview = await pool.query(
    `SELECT id FROM reviews
    WHERE booking_id = $1`,
    [booking_id]
    );

    if (existingReview.rows.length > 0) {
    return res.status(400).json({
    message: "This booking already has a review"
    });
}

    const result = await pool.query(
      `INSERT INTO reviews
      (booking_id, rating, comment)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [booking_id, rating, comment]
    );

    res.status(201).json({
      message: "Review created successfully",
      review: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create review"
    });
  }
};

// Get all reviews
const getReviews = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM reviews
       ORDER BY created_at DESC`
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get reviews"
    });
  }
};

// Get review by ID
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM reviews
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get review"
    });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rating,
      comment
    } = req.body;

    const result = await pool.query(
      `UPDATE reviews
       SET rating = $1,
           comment = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [rating, comment, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.status(200).json({
      message: "Review updated successfully",
      review: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update review"
    });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM reviews
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.status(200).json({
      message: "Review deleted successfully",
      review: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete review"
    });
  }
};

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview
};