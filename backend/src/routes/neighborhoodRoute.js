const express = require("express");

const {
  getAllNeighborhoods,
  insertNeighborhood,
} = require("../controllers/neighborhoodController");

const router = express.Router();

router.get("/", getAllNeighborhoods);

router.post("/", insertNeighborhood);

module.exports = router;
