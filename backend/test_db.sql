-- Table: users
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(45) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: reviews
DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  movies_id INT NOT NULL,
  users_id INT NOT NULL,
  rating INT,
  comment VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type VARCHAR(45),
  CONSTRAINT fk_reviews_users FOREIGN KEY (users_id)
    REFERENCES users (id)
);

-- Unit Testing: Inserting test data for user and review tables to test review browsing feature
INSERT INTO users (email, password) VALUES ('test@email', '123456');
INSERT INTO reviews (users_id, movies_id, rating, comment, type) VALUES ('1', '1', '4','test review to get tv series review for a spesific one', 'tv' );
INSERT INTO reviews (users_id, movies_id, rating, comment, type) VALUES ('1', '1', '4','test review to get tv series review for a spesific one', 'movie' );
-- Zhang Ke add
INSERT INTO users (email, password) VALUES ('testuser1@example.com', 'password123');
INSERT INTO users (email, password) VALUES ('testuser2@example.com', 'password456');