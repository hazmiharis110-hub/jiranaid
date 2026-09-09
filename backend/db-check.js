const pool = require("./src/config/db");

async function checkDatabase() {
  try {
    const database = await pool.query("SELECT NOW() AS server_time");
    const neighborhoods = await pool.query(
      "SELECT id, name, city, postcode FROM neighborhoods ORDER BY id LIMIT $1",
      [5],
    );

    console.log(database.rows[0]);
    console.table(neighborhoods.rows);
  } catch (error) {
    console.error("Database check failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

checkDatabase();
