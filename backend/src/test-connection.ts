import pool from "./db/connection";

async function testConnection() {
  try {
    await pool.query("SELECT 1");

    console.log("Database connected!");
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await pool.end();
  }
}

testConnection();