import pool from "./db/connection";

async function createUser() {
  try {
    const result = await pool.query(`
      INSERT INTO users (
        name,
        email,
        password_hash,
        bio
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [
      "Kumar",
      "kumar@test.com",
      "temporary_hash",
      "Another JiranAid user"
    ]);

    console.log(result.rows);
  } catch (error) {
    console.error("Something went wrong:", error);
  } finally {
    await pool.end();
  }
}

createUser();