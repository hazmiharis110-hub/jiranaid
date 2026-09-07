import pool from "./db/connection";

async function getUsers() {
  try {
    const result = await pool.query(`
    SELECT name, email
    FROM users
    WHERE id = $1;
    `, [2]);

    console.log(result.rows);
  } catch (error) {
    console.error("Something went wrong:", error);
  } finally {
    await pool.end();
  }
}

getUsers();