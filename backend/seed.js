const pool = require("./src/config/db");

async function seed() {
  try {
    console.log("Seeding database...");
    await pool.query(`
      INSERT INTO neighborhoods (id, name, city, postcode) 
      VALUES (1, 'Taman Puchong Prima', 'Puchong', '47150') 
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seed();
