import pool from "./db/connection";

async function testRelationships() {
  try {
    // 1. Create second user
    const userResult = await pool.query(`
      INSERT INTO users (name, email, password_hash, bio)
      VALUES (
        'Aiman',
        'aiman@test.com',
        'temporary_hash',
        'JiranAid test borrower'
      )
      RETURNING *;
    `);

    const borrower = userResult.rows[0];

    console.log("Second user created:");
    console.log(borrower);

    // 2. Create booking
    const bookingResult = await pool.query(`
      INSERT INTO bookings (
        borrower_id,
        item_id,
        start_date,
        end_date,
        total_fee,
        status
      )
      VALUES (
        $1,
        1,
        '2026-09-10',
        '2026-09-12',
        0,
        'APPROVED'
      )
      RETURNING *;
    `, [borrower.id]);

    const booking = bookingResult.rows[0];

    console.log("Booking created:");
    console.log(booking);

    // 3. Create review
    const reviewResult = await pool.query(`
      INSERT INTO reviews (
        reviewer_id,
        booking_id,
        rating,
        comment
      )
      VALUES (
        $1,
        $2,
        5,
        'The drill was in great condition!'
      )
      RETURNING *;
    `, [borrower.id, booking.id]);

    console.log("Review created:");
    console.log(reviewResult.rows[0]);

  } catch (error) {
    console.error("Something went wrong:", error);
  } finally {
    await pool.end();
  }
}

testRelationships();