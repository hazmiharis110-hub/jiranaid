import pool from "./db/connection";

async function deleteUser() {
  try {
    const result = await pool.query(`
      DELETE FROM users
      WHERE id = $1
      RETURNING *;
    `, [3]);

    console.log(result.rows);
  } catch (error) {
    console.error("Something went wrong:", error);
  } finally {
    await pool.end();
  }
}

deleteUser();