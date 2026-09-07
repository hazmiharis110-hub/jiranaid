import pool from "../db/connection";

export async function getAllItems() {
  const result = await pool.query(`
    SELECT 
      items.id, 
      items.title, 
      items.description, 
      items.condition, 
      items.deposit_amount, 
      items.availability, 
      users.name AS owner, 
      categories.name AS category
    FROM items
    JOIN users 
      ON items.owner_id = users.id
    JOIN categories 
      ON items.category_id = categories.id;
  `);

  return result.rows;
}


export async function createItem(
  ownerId: number,
  categoryId: number,
  title: string,
  description: string,
  condition: string,
  depositAmount: number
) {
  const result = await pool.query(`
    INSERT INTO items (
      owner_id,
      category_id,
      title,
      description,
      condition,
      deposit_amount
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `, [
    ownerId,
    categoryId,
    title,
    description,
    condition,
    depositAmount
  ]);

  return result.rows[0];
}


export async function updateItem(
  id: number,
  title: string,
  description: string,
  condition: string,
  depositAmount: number
) {
    const result = await pool.query(`
    UPDATE items
    SET title = $1,
        description = $2,
        condition = $3,
        deposit_amount = $4,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *;    
    `, [
      title,
      description,
      condition,
      depositAmount,
      id
    ]);

    return result.rows[0];
  }

  export async function deleteItem(id: number) {
  const result = await pool.query(`
    DELETE FROM items
    WHERE id = $1
    RETURNING *;
  `, [id]);

  return result.rows[0];
}

export async function findUserById(id: number) {
  const result = await pool.query(
    `SELECT id FROM users WHERE id = $1`,
    [id]
  );

  return result.rows[0];
}

export async function findCategoryById(id: number) {
  const result = await pool.query(
    `SELECT id FROM categories WHERE id = $1`,
    [id]
  );

  return result.rows[0];
}

export async function getItemById(id: number) {
  const result = await pool.query(`
    SELECT 
      items.id,
      items.title,
      items.description,
      items.condition,
      items.deposit_amount,
      items.availability,
      users.name AS owner,
      categories.name AS category
    FROM items
    JOIN users
      ON items.owner_id = users.id
    JOIN categories
      ON items.category_id = categories.id
    WHERE items.id = $1;
  `, [id]);

  return result.rows[0];
}