import pool from "./db/connection";

async function updateUser() {
  try {
    const result = await pool.query(`
      UPDATE users
      SET bio = $1
      WHERE id = $2
      RETURNING *;
    `, [
      "Updated JiranAid user",
      3
    ]);

    console.log(result.rows);
  } catch (error) {
    console.error("Something went wrong:", error);
  } finally {
    await pool.end();
  }
}

updateUser();