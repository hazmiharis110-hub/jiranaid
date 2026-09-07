import { Request, Response } from "express";
import {
  getItems,
  getItem as getItemService,
  createItem as createItemService,
  updateItem as updateItemService,
  deleteItem as deleteItemService
} from "../services/itemService";

export async function getAllItems(req: Request, res: Response) {
  try {
    const items = await getItems();

    res.json(items);
  } catch (error) {
    console.error("Failed to fetch items:", error);

    res.status(500).json({
      message: "Failed to fetch items",
    });
  }
}
export async function updateItem(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const {
      title,
      description,
      condition,
      deposit_amount
    } = req.body;

    const item = await updateItemService(
      id,
      title,
      description,
      condition,
      deposit_amount
    );

    res.json(item);

  } catch (error) {
  console.error("Failed to update item:", error);

  res.status(500).json({
    message: "Failed to update item",
  });
}
}
export async function createItem(req: Request, res: Response) {

  try {
    const {
      owner_id,
      category_id,
      title,
      description,
      condition,
      deposit_amount
    } = req.body;

    if (!owner_id || !category_id || !title || !condition) {
        return res.status(400).json({
        message: "Required fields are missing",
        });
    }

    if(typeof owner_id !== 'number' || typeof category_id !== 'number'){
        return res.status(400).json({
            message: "owner_id and category_id must be numbers",
        });
    }

    if(deposit_amount <0){
        return res.status(400).json({
            message: "deposit_amount cannot be a negative number",
        }); 
    }
    const item = await createItemService(
      owner_id,
      category_id,
      title,
      description,
      condition,
      deposit_amount
    );

    res.status(201).json(item);

  } catch (error) {
    console.error("Failed to create item:", error);

    if( error instanceof Error && error.message === "Owner does not exist") {
        return res.status(404).json({
            message: "Owner does not exist",
        });
    }

    if (error instanceof Error && error.message === "Category does not exist") {
        return res.status(404).json({
            message: "Category does not exist",
        });
    }

    res.status(500).json({
      message: "Failed to create item",
    });
  }
}
export async function deleteItem(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const item = await deleteItemService(id);

    if (!item) {
        return res.status(404).json({ 
            message: "Item not found" 
        });
    }

    res.json(item);


  } catch (error) {
    console.error("Failed to delete item:", error);

    res.status(500).json({
      message: "Failed to delete item",
    });
  }
}

export async function getItem(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const item = await getItemService(id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.json(item);

  } catch (error) {
    console.error("Failed to fetch item:", error);

    res.status(500).json({
      message: "Failed to fetch item",
    });
  }
}