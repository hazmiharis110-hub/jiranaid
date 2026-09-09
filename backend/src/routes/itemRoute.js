const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllItems,
  getItemById,
  insertItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");

const router = express.Router();

router.get("/", authMiddleware, getAllItems);
router.get("/:id", authMiddleware, getItemById);
router.post("/", authMiddleware, insertItem);
router.put("/:id", authMiddleware, updateItem);
router.delete("/:id", authMiddleware, deleteItem);
module.exports = router;
