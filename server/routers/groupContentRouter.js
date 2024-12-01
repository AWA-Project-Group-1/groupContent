import { pool } from '../helpers/db.js';
import { Router } from 'express';

const router = Router();

router.post('/:groupId/content', async (req, res) => {
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    
    const { groupId } = req.params;
    const { userId, movies = [], showTimes = [] } = req.body;

    console.log(`Group ID: ${groupId}, User ID: ${userId}`);
    console.log('Movies:', movies);
    console.log('ShowTimes:', showTimes);

    try {
        const groupResult = await pool.query('SELECT id FROM groups WHERE id = $1', [groupId]);
        if (groupResult.rowCount === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Thêm movies vào groupContent
        const movieQueries = movies.map((movie) => {
            if (!movie.id || !movie.title || !movie.poster_path) {
                console.warn('Invalid movie data:', movie);
                return Promise.resolve(); // Bỏ qua movie không hợp lệ
            }
            return pool.query(
                `INSERT INTO groupContent (group_id, users_id, movie_id, movie_title, movie_poster_path)
                 VALUES ($1, $2, $3, $4, $5)`,
                [groupId, userId, movie.id, movie.title, movie.poster_path]
            );
        });

        // Thêm showTimes vào groupContent
        const showTimeQueries = showTimes.map((show) => {
            if (!show.id || !show.title || !show.showStart || !show.showEnd || !show.image) {
                console.warn('Invalid showTime data:', show);
                return Promise.resolve(); // Bỏ qua showTime không hợp lệ
            }
            return pool.query(
                `INSERT INTO groupContent (group_id, users_id, show_time_id, show_time_title, show_time_start, show_time_end, show_time_image)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [groupId, userId, show.id, show.title, show.showStart, show.showEnd, show.image]
            );
        });

        // Thực hiện song song tất cả các truy vấn
        await Promise.all([...movieQueries, ...showTimeQueries]);

        res.status(201).json({ message: 'Content added successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error adding content' });
    }
});


export default router;


