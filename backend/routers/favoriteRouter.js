import express from 'express';
import { pool } from '../helpers/db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const tmdbApiKey = "8e00f8de49614d9ebf140af3901aa5b5"; // Ensure this is set in your .env file

// Middleware to authenticate user and extract user ID
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach user ID to the request object
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Add a movie or TV show to favorites
router.post('/add', authenticate, async (req, res) => {
  const { movieId, type } = req.body;
  const userId = req.userId;

  try {
    // Fetch the title from TMDB API
    const tmdbUrl = `https://api.themoviedb.org/3/${type}/${movieId}?api_key=${tmdbApiKey}`;
    const response = await fetch(tmdbUrl);
    const data = await response.json();

    const title = data.title || data.name; // Movies use 'title', TV shows use 'name'

    await pool.query(
      'INSERT INTO favorites (users_id, movie_id, title, type) VALUES ($1, $2, $3, $4)',
      [userId, movieId, title, type]
    );

    res.status(201).json({ message: `${type} "${title}" added to favorites` });
  } catch (error) {
    console.error(`Error adding ${type} to favorites:`, error);
    res.status(500).json({ error: `Failed to add ${type} to favorites` });
  }
});

// Fetch all favorite movies or TV shows for the logged-in user
router.get('/user', authenticate, async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      'SELECT movie_id, title, type FROM favorites WHERE users_id = $1',
      [userId]
    );
    res.json(result.rows); // Return rows including movie_id, title, and type
  } catch (error) {
    console.error('Error fetching favorite items:', error);
    res.status(500).json({ error: 'Failed to fetch favorite items' });
  }
});

// Remove a movie or TV show from favorites
router.delete('/remove', authenticate, async (req, res) => {
  const { movieId } = req.body;
  const userId = req.userId;

  try {
    await pool.query(
      'DELETE FROM favorites WHERE users_id = $1 AND movie_id = $2',
      [userId, movieId]
    );
    res.status(200).json({ message: 'Item removed from favorites' });
  } catch (error) {
    console.error('Error removing item from favorites:', error);
    res.status(500).json({ error: 'Failed to remove item from favorites' });
  }
});

// Get shared favorites for a specific user by userId
router.get('/shared-favorites/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Fetch the user's favorites from the database
    const result = await pool.query(
      'SELECT movie_id AS id, title, type FROM favorites WHERE users_id = $1',
      [userId]
    );
    res.json(result.rows); // Return rows including id, title, and type
  } catch (error) {
    console.error('Error fetching shared favorite items:', error);
    res.status(500).json({ error: 'Failed to fetch shared favorite items' });
  }
});

// Get user email by userId
router.get('/user-email/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const result = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ email: result.rows[0].email });
  } catch (error) {
    console.error('Error fetching user email:', error);
    res.status(500).json({ error: 'Failed to fetch user email' });
  }
});

export default router;