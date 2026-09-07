import {
  getAllItems,
  getItemById,
  createItem as createItemRepository,
  updateItem as updateItemRepository,
  deleteItem as deleteItemRepository,
  findUserById,
  findCategoryById 
} from "../repositories/itemRepository";

export async function getItems() {
  const items = await getAllItems();

  return items;
}

export async function getItem(id: number) {
  const item = await getItemById(id);

  return item;
}

export async function createItem(
  ownerId: number,
  categoryId: number,
  title: string,
  description: string,
  condition: string,
  depositAmount: number
) {
  const owner = await findUserById(ownerId);
  
  if (!owner) {
    throw new Error("Owner does not exist");
  }

  const category = await findCategoryById(categoryId);

    if (!category) {
        throw new Error("Category does not exist");
    }
  const item = await createItemRepository(
    ownerId,
    categoryId,
    title,
    description,
    condition,
    depositAmount
  );

  return item;
}

export async function updateItem(
  id: number,
  title: string,
  description: string,
  condition: string,
  depositAmount: number
) {
  const item = await updateItemRepository(
    id,
    title,
    description,
    condition,
    depositAmount
  );

  return item;
}

export async function deleteItem(id: number) {
  const item = await deleteItemRepository(id);

  return item;
}