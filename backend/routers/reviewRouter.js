import express from 'express';
import { pool } from '../helpers/db.js';

const router = express.Router();
// GET request for fetching reviews for a specific movie or TV show
router.get('/reviews/:contentType/:movieId', (req, res) => {
    const { contentType, movieId } = req.params;

    const query = `
        SELECT reviews.id, reviews.movies_id, reviews.rating, reviews.comment, reviews.type, reviews.created_at, users.email
        FROM reviews
        INNER JOIN users ON reviews.users_id = users.id
        WHERE reviews.movies_id = $1 AND reviews.type = $2
    `;

    pool.query(query, [movieId, contentType], (error, result) => {
        if (error) {
            console.error('Error executing query', error.stack);
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(result.rows);
    });
});

// GET request for fetching reviews for a specific movie or TV show of the logged-in user (hardcoded)
router.get('/reviews/user/:userId/:contentType/:movieId', (req, res) => {
    const { userId, contentType, movieId } = req.params;

    // Query to get the logged-in user's review for the specific movie or TV show
    const query = `
        SELECT reviews.id, reviews.movies_id, reviews.rating, reviews.comment, reviews.type, reviews.created_at, users.email
        FROM reviews
        INNER JOIN users ON reviews.users_id = users.id
        WHERE reviews.users_id = $1 AND reviews.type = $2 AND reviews.movies_id = $3
    `;

    pool.query(query, [userId, contentType, movieId], (error, result) => {
        if (error) {
            console.error('Error executing query', error.stack);
            return res.status(500).json({ error: error.message });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        return res.status(200).json(result.rows[0]); // Return the user's review
    });
});


// POST request to add a new review
router.post('/reviews', (req, res) => {
    const { movieId, rating, comment, type } = req.body;

    // Validate that all required fields are provided
    if (!movieId || !rating || !comment || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate that 'type' is either 'movie' or 'tv'
    if (type !== 'movie' && type !== 'tv') {
        return res.status(400).json({ error: "Invalid 'type' field. Must be 'movie' or 'tv'" });
    }

    const userId = 2; // Hardcoded userId for testing purposes, replace with dynamic user ID (e.g., from session or JWT token)

    const query = `
        INSERT INTO reviews (movies_id, users_id, rating, comment, type)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    const values = [movieId, userId, rating, comment, type];

    pool.query(query, values, (error, result) => {
        if (error) {
            console.error('Error executing query', error.stack);
            return res.status(500).json({ error: error.message });
        }
        return res.status(201).json(result.rows[0]);
    });
});

// DELETE request to delete a review by ID (only if the user is authorized)
router.delete('/reviews/:reviewId', (req, res) => {
    const reviewId = req.params.reviewId;
    const hardcodedUserId = 2; // Hardcoded user ID

    // Log the user ID and review ID before deleting
    console.log(`Attempting to delete review ID: ${reviewId} by user ID: ${hardcodedUserId}`);

    // Step 1: Check if the review belongs to the hardcoded user
    const checkOwnershipQuery = `
        SELECT * FROM reviews
        WHERE id = $1 AND users_id = $2;
    `;

    pool.query(checkOwnershipQuery, [reviewId, hardcodedUserId], (ownershipError, ownershipResult) => {
        if (ownershipError) {
            console.error('Error executing ownership check query', ownershipError.stack);
            return res.status(500).json({ error: ownershipError.message });
        }

        if (ownershipResult.rowCount === 0) {
            // Log the message if the user is not authorized
            console.log(`User ${hardcodedUserId} is not authorized to delete review ID: ${reviewId}`);
            return res.status(403).json({ error: 'You are not authorized to delete this review' });
        }

        // Step 2: Proceed with deletion if ownership is verified
        const deleteQuery = `
            DELETE FROM reviews
            WHERE id = $1
            RETURNING *;
        `;

        pool.query(deleteQuery, [reviewId], (deleteError, deleteResult) => {
            if (deleteError) {
                console.error('Error executing delete query', deleteError.stack);
                return res.status(500).json({ error: deleteError.message });
            }

            // Log success if the review was deleted
            console.log(`Review ID: ${reviewId} deleted successfully by user ID: ${hardcodedUserId}`);
            return res.status(200).json({
                message: 'Review deleted successfully',
                review: deleteResult.rows[0],
            });
        });
    });
});


export default router;