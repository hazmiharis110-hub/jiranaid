import pool from "../db/connection";

export async function getAllNeighborhoods() {
  const result = await pool.query(`
    SELECT *
    FROM neighborhoods
    ORDER BY id;
  `);

  return result.rows;
}

export async function createNeighborhood(
  name: string,
  postcode: string,
  city: string
) {
  const result = await pool.query(`
    INSERT INTO neighborhoods (
      name,
      postcode,
      city
    )
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [
    name,
    postcode,
    city
  ]);

  return result.rows[0];
}

export async function getNeighborhoodById(id: number) {
  const result = await pool.query(`
    SELECT *
    FROM neighborhoods
    WHERE id = $1;
  `, [id]);

  return result.rows[0];
}

export async function updateNeighborhood(
  id: number,
  name: string,
  postcode: string,
  city: string
) {
  const result = await pool.query(`
    UPDATE neighborhoods
    SET name = $1,
        postcode = $2,
        city = $3,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *;
  `, [
    name,
    postcode,
    city,
    id
  ]);

  return result.rows[0];
}

export async function deleteNeighborhood(id: number) {
  const result = await pool.query(`
    DELETE FROM neighborhoods
    WHERE id = $1
    RETURNING *;
  `, [id]);

  return result.rows[0];
}