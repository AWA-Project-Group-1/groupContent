import express from 'express';
import { pool } from '../helpers/db.js';

const router = express.Router();
const hardcodedUserId = 945; // Hardcoded user ID for simplicity

// Add a movie to favorites
router.post('/add', async (req, res) => {
  const { movieId, type } = req.body;
  try {
    console.log('Received data:', req.body);
    await pool.query('INSERT INTO favorites (users_id, movie_id, type) VALUES ($1, $2, $3)', [hardcodedUserId, movieId, type]);
    res.status(201).json({ message: `${type} added to favorites` });
    
  } catch (error) {
    console.error(`Error adding ${type} to favorites:`, error);
    res.status(500).json({ error: `Failed to add ${type} to favorites` });
  }
});

// Fetch all favorite movies for the user
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const result = await pool.query(
        'SELECT movie_id, type FROM favorites WHERE users_id = $1', 
        [userId]
      );
      res.json(result.rows); // Return rows as is to include movie_id and type
    } catch (error) {
      console.error('Error fetching favorite movies:', error);
      res.status(500).json({ error: 'Failed to fetch favorite movies' });
    }
  });

// Remove a movie from favorites
router.delete('/remove', async (req, res) => {
  const { movieId } = req.body;
  try {
    await pool.query('DELETE FROM favorites WHERE users_id = $1 AND movie_id = $2', [hardcodedUserId, movieId]);
    res.status(200).json({ message: 'Movie removed from favorites' });
  } catch (error) {
    console.error('Error removing movie from favorites:', error);
    res.status(500).json({ error: 'Failed to remove movie from favorites' });
  }
});

export default router;