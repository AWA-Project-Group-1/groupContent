// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import favoriteRouter from './routers/favoriteRouter.js';
import reviewsRouter from './routers/reviewRouter.js'
import { pool } from './helpers/db.js'; // Optional: test database connection on startup

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected:', res.rows[0]);
  }
});

// Routes
app.use('/api/favorites', favoriteRouter);

// Use the reviews router for /reviews endpoint
app.use('/reviews', reviewsRouter);

// Fallback route for 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});