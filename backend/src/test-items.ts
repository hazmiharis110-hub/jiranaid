import pool from "./db/connection";

async function getItems() {
  try {
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

    console.log(result.rows);
  } catch (error) {
    console.error("Something went wrong:", error);
  } finally {
    await pool.end();
  }
}

getItems();