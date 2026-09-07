import { Request, Response } from "express";
import { getNeighborhoods,
    getNeighborhood,
    createNeighborhood as createNeighborhoodService,
    updateNeighborhood as updateNeighborhoodService,
    deleteNeighborhood as deleteNeighborhoodService
} from "../services/neighborhoodService";

export async function getAllNeighborhoods(
  req: Request,
  res: Response
) {
  try {
    const neighborhoods = await getNeighborhoods();

    res.json(neighborhoods);
  } catch (error) {
    console.error("Failed to fetch neighborhoods:", error);

    res.status(500).json({
      message: "Failed to fetch neighborhoods",
    });
  }
}

export async function getNeighborhoodById(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const neighborhood = await getNeighborhood(id);

    if (!neighborhood) {
      return res.status(404).json({
        message: "Neighborhood not found",
      });
    }

    res.json(neighborhood);

  } catch (error) {
    console.error("Failed to fetch neighborhood:", error);

    res.status(500).json({
      message: "Failed to fetch neighborhood",
    });
  }
}

export async function createNeighborhood(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      postcode,
      city
    } = req.body;

    if (!name || !postcode || !city) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const neighborhood = await createNeighborhoodService(
      name,
      postcode,
      city
    );

    res.status(201).json(neighborhood);

  } catch (error) {
    console.error("Failed to create neighborhood:", error);

    res.status(500).json({
      message: "Failed to create neighborhood",
    });
  }
}

export async function updateNeighborhood(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const {
      name,
      postcode,
      city
    } = req.body;

    if (!name || !postcode || !city) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const neighborhood = await updateNeighborhoodService(
      id,
      name,
      postcode,
      city
    );

    if (!neighborhood) {
      return res.status(404).json({
        message: "Neighborhood not found",
      });
    }

    res.json(neighborhood);

  } catch (error) {
    console.error("Failed to update neighborhood:", error);

    res.status(500).json({
      message: "Failed to update neighborhood",
    });
  }
}

export async function deleteNeighborhood(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const neighborhood = await deleteNeighborhoodService(id);

    if (!neighborhood) {
      return res.status(404).json({
        message: "Neighborhood not found",
      });
    }

    res.json(neighborhood);

  } catch (error) {
    console.error("Failed to delete neighborhood:", error);

    res.status(500).json({
      message: "Failed to delete neighborhood",
    });
  }
}