const express = require("express");

const router = express.Router();

const {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  declineBooking,
  approvedBooking,
  activateBooking,
  returnBooking
} = require("../controllers/bookingController");

router.post("/", createBooking);

router.get("/", getBookings);

router.get("/:id", getBookingById);

router.put("/:id/cancel", cancelBooking);

router.put("/:id/decline", declineBooking);

router.put("/:id/approve", approvedBooking);

router.put("/:id/activate", activateBooking);

router.put("/:id/return", returnBooking);

module.exports = router;
