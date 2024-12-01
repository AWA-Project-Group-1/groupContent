import { pool } from '../helpers/db.js';
import { Router } from 'express';
import { auth } from '../helpers/auth.js';
//import { authenticateToken } from '../helpers/authenticateToken.js';
import { getGroups, postGroup } from '../controllers/GroupController.js';


const router = Router();

router.get('/', getGroups);

router.post('/create', postGroup);

router.delete('/delete/:id',auth,(req, res, next) => {
    const id = parseInt(req.params.id)
    console.log(`Attempting to delete group with ID: ${id}`);

    pool.query('DELETE FROM groupContent WHERE group_id = $1', [id]);
    pool.query('DELETE FROM groupMembers WHERE group_id = $1', [id]);
    pool.query('DELETE FROM groups WHERE id = $1', [id], (error, result) => {
            if (error) {
                console.error("Database error: ", error);
                return next(error);
            }

            if (result.rowCount === 0) {
                console.error("Group not found for ID:", id);
                return res.status(404).json({ message: "Group not found" });
            }
    
            console.log("Group deleted successfully.");
            return res.status(200).json({ message: "Group deleted successfully", id: id });
    });
});


router.get('/group/:id', async (req, res) => {
    console.log("Group ID requested:", req.params.id);
    const { id } = req.params;
    const group = await findGroupById(id); // Hàm tìm nhóm
    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }
    res.json(group);
});

// server/routes/groupRouter.js
/*
router.get("/group/:id/authorize", async (req, res) => {
    const { id } = req.params;
    //const userId = req.user.id; // Lấy user ID từ token hoặc request
    const userEmail = req.user.user; // Lấy email từ token
  
    try {
      const groupMember = await pool.query(
      //  "SELECT * FROM groupMembers WHERE group_id = $1 AND users_id = $2", [id, userId]
         "SELECT * FROM groupMembers g JOIN users u ON g.users_id = u.id WHERE g.group_id = $1 AND u.email = $2", [id, userEmail]
      );
  
      if (groupMember.rows.length > 0) {
        res.status(200).json({ authorized: true });
      } else {
        res.status(403).json({ authorized: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  });

*/
router.get("/group/:id/authorize", (req, res) => {
  //const { groupid } = req.params;

  const isAuthorized = true; // Thay đổi thành logic thực tế
  if (isAuthorized) {
    res.status(200).json({ authorized: true });
  } else {
    res.status(403).json({ authorized: false });
  }
});
/*
router.post('/:id/content', async (req, res) => {
    const { id } = req.params;
    const { userId, movies = [], showTimes = [] } = req.body;

    console.log(`Group ID: ${id}, User ID: ${userId}`);
    console.log('Movies:', movies);
    console.log('ShowTimes:', showTimes);

    try {
        const group = await findGroupById(id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Thêm movies vào groupContent
        const movieQueries = movies.map((movie) =>
            pool.query(
                `INSERT INTO groupContent (group_id, users_id, movie_id, movie_title, movie_poster_path)
                 VALUES ($1, $2, $3, $4, $5)`,
                [id, userId, movie.id, movie.title, movie.poster_path]
            )
        );

        // Thêm showTimes vào groupContent
        const showTimeQueries = showTimes.map((show) =>
            pool.query(
                `INSERT INTO groupContent (group_id, users_id, show_time_id, show_time_title, show_time_start, show_time_end, show_time_image)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [id, userId, show.id, show.title, show.showStart, show.showEnd, show.image]
            )
        );

        // Thực hiện song song tất cả các truy vấn
        await Promise.all([...movieQueries, ...showTimeQueries]);

        res.status(201).json({ message: 'Content added successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error adding content' });
    }
});
*/

export default router;


