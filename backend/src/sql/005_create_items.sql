CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    main_image TEXT,
    condition VARCHAR(50),
    deposit_amount DECIMAL(10, 2) DEFAULT 0,
    availability BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);