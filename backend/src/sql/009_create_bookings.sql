CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    borrower_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_fee DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (borrower_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES items(id),

    CHECK (end_date >= start_date)
);