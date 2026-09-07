CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    reviewer_id INTEGER NOT NULL,
    booking_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (reviewer_id) REFERENCES users(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),

    CHECK (rating >= 1 AND rating <= 5),

    UNIQUE (reviewer_id, booking_id)
);