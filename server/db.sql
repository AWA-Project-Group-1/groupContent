CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(45)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    movies_id INT NOT NULL,
    users_id INT NOT NULL,
    rating INT,
    comment VARCHAR(500),
    type VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE
);
