import express from 'express';
import { pool } from '../helpers/db.js';

const router = express.Router();
// GET request for fetching reviews of a specific movie
router.get('/:movieId', (req, res) => {
    const movieId = req.params.movieId;
    const query = `
        SELECT reviews.id, reviews.movies_id, reviews.rating, reviews.comment, reviews.created_at, users.email
        FROM reviews
        INNER JOIN users ON reviews.users_id = users.id
        WHERE reviews.movies_id = $1
    `;

    pool.query(query, [movieId], (error, result) => {
        if (error) {
            console.error('Error executing query', error.stack);
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(result.rows);
    });
});

// POST request to add a new review
router.post('/', (req, res) => {
    const { movieId, rating, comment } = req.body;

    // Validate that all required fields are provided
    if (!movieId || !rating || !comment) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const userId = 2; // Hardcoded userId for all posts
    const query = `
        INSERT INTO reviews (movies_id, users_id, rating, comment)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    const values = [movieId, userId, rating, comment];

    pool.query(query, values, (error, result) => {
        if (error) {
            console.error('Error executing query', error.stack);
            return res.status(500).json({ error: error.message });
        }
        return res.status(201).json(result.rows[0]);
    });
});

export default router;