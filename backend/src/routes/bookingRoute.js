const express = require("express");

const router = express.Router();

const {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  declineBooking,
  approvedBooking,
} = require("../controllers/bookingController");

router.post("/", createBooking);

router.get("/", getBookings);

router.get("/:id", getBookingById);

router.put("/:id/cancel", cancelBooking);

router.put("/:id/decline", declineBooking);

router.put("/:id/approve", approvedBooking);

module.exports = router;
