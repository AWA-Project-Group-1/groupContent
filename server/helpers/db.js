import pkg from 'pg';

const { Pool } = pkg;

// Create a singleton pool instance
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'movie_reviews',
    password: 'root',
    port: 5432,
});

export { pool };
