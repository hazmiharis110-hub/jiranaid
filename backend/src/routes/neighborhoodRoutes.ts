import express from "express";
import {
  getAllNeighborhoods,
  getNeighborhoodById,
  createNeighborhood,
  updateNeighborhood,
  deleteNeighborhood
} from "../controllers/neighborhoodController";

const router = express.Router();

router.get("/", getAllNeighborhoods);
router.get("/:id", getNeighborhoodById);
router.post("/", createNeighborhood);
router.put("/:id", updateNeighborhood);
router.delete("/:id", deleteNeighborhood);
export default router;