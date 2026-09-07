import pool from "./db/connection";

async function testJoin() {
  try {
    const result = await pool.query(`
      SELECT
        users.name AS borrower,
        items.title AS item,
        bookings.start_date,
        bookings.end_date,
        bookings.status,
        reviews.rating,
        reviews.comment
      FROM bookings

      JOIN users
        ON bookings.borrower_id = users.id

      JOIN items
        ON bookings.item_id = items.id

      JOIN reviews
        ON reviews.booking_id = bookings.id;
    `);

    console.log(result.rows);

  } catch (error) {
    console.error("Something went wrong:", error);
  } finally {
    await pool.end();
  }
}

testJoin();