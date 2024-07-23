const { pool } = require("../db/db");

/* ------ functions for all users ------ */

const getProfile = async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows: user } = await client.query(
      "SELECT * FROM users WHERE id = $1 LIMIT 1",
      [req.body.id]
    );
    if (user.length === 0) {
      return res.status(404).json({ status: "error", msg: "User not found" });
    }
    res.json(user[0]);
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: "error", msg: "Error retrieving user information" });
  } finally {
    client.release();
  }
};

const updateProfilePicture = async(req, res) => {
    const client = await pool.connect();
    try {
    await client.query(`UPDATE users (profile_picture) VALUES ($1) WHERE id = $2`,
        [req.result, req.params.id]);
    res.status(200).json({status: 'success', msg: 'Profile picture has been updated'})
    }
    catch(error){
    console.error(error);
    res.status(400).json({status: 'error', msg:'Error uploading profile picture'})
    }
    finally {client.release();}
}


const updateProfile = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query(
      `UPDATE users SET name = $1, description = $2, sports = $3, 
      goals = $4, contact_number = $5, facebook = $6, instagram = $7  WHERE id = $8`,
      [
        req.body.name,
        req.body.description,
        req.body.sports,
        req.body.goals,
        req.body.number,
        req.body.facebook,
        req.body.instagram,
        req.body.id,
      ]
    );
    res.json({ status: "success", msg: "User information has been updated" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "error", msg: "" });
  } finally {
    client.release();
  }
};

const getActivities = async (req, res) => {
  const client = await pool.connect();
  const filters = [];
  const params = [];
  const query = "SELECT * FROM activities";
  if (req.body.dateStart && req.body.dateEnd) {
    filters.push(
      "date BETWEEN $" + (filters.length + 1) + "AND $" + (filters.length + 1)
    );
    params.push(req.body.dateStart, req.body.dateEnd);
  }
  if (req.body.coach) {
    filters.push("coach = $" + (filters.length + 1));
    params.push(req.body.coach);
  }
  if (req.body.athlete) {
    filters.push("athlete = $" + (filters.length + 1));
    params.push(req.body.athlete);
  }
  if (filters.length > 0) {
    query += " WHERE " + filters.join(" AND ");
  }
  try {
    const { rows: activities } = client.query(query, params);
    if (activities.length === 0)
      res.status(404).json({ status: "error", msg: "No activities found" });
    res.json(activities);
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ status: "error", msg: "Error retrieiving activities" });
  } finally {
    client.release();
  }
};


/* ------ functions for athletes ------ */

const getCoaches = async (req, res) => {
  const client = await pool.connect();
  const query = `SELECT * FROM users WHERE role = $1`;
  let filters = 1;
  const params = [req.body.role];
  if (req.body.sport) {
    filters += 1;
    query += `AND (sport LIKE '%$${filters}%')`;
    params.push(req.body.sport);
  }
  if (req.body.gender) {
    filters += 1;
    query += `AND gender = $${filters}`;
    params.push(req.body.gender);
  }
  try {
    const { rows: coaches } = client.query(query, params);
    if (coaches.length === 0)
      res.status(404).json({ status: 'error', msg: 'No coach(es) found' });
    res.json(coaches);
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: 'error', msg: 'Error retrieving coaches' });
  } finally {
    client.release();
  }
};

const getOwnCoaches = async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows: coaches } = await client.query(
      `SELECT * FROM users JOIN users_users 
      ON user.id = users_users.coach_id WHERE users_users.athlete_id = $1`,
      [req.params.id]
    );
    if (coaches.length === 0) {
        res.status(404).json({status: 'error', msg: 'No coach(es) found'})
    }
    res.json(coaches);
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: 'error', msg: 'Error retrieving own coaches' });
  } finally {
    client.release();
  }
};

const commentOwnActivity = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query(`UPDATE activities SET athlete_comment = $1 WHERE id = $2`, 
        [req.body.comment, req.params.id]);
    res.status(200).json({status: 'success', msg: 'updated activity with comments'})
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "error", msg: "" });
  } finally {
    client.release();
  }
};

const addReview= async (req, res) => {
    const client = await pool.connect();
    try {
      await client.query(`INSERT INTO users_users (review) WHERE athlete_id = $1 
          AND coach_id = $2 VALUES ($3)`, [req.body.athlete_id, req.body.coach_id, req.body.review])
    } catch (error) {
      console.error(error);
      res.status(400).json({ status: "error", msg: "" });
    } finally {
      client.release();
    }
  };
  

/* ------ functions for coaches ------ */

const getOwnAthletes = async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows: athletes } = await client.query(
      `SELECT * FROM users JOIN users_users ON user.id 
      = users_users.athlete_id WHERE users_users.coach_id = $1`,
      [req.params.id]
    );
    res.json(athletes);
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "error", msg: "Error retrieving own athletes" });
  } finally {
    client.release();
  }
};

const addAthlete = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const {rows: user} = await client.query(`SELECT * FROM users WHERE role = $1 AND email = $2 
        LIMIT 1`, ["ATHLETE", req.body.email])
        if (user.length === 0) {
            res.status(404).json({status: 'error', msg: 'No athlete found'})
        }
    const athlete_id = user[0].id;
    await client.query(`INSERT into users_users (athlete_id, coach_id) VALUES ($1, $2)`, [athlete_id, req.body.coach_id]);
    await client.query('COMMIT');
    res.status(200).json({status: 'success', msg: 'Added athlete successfully'})
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(400).json({ status: 'error', msg: 'Error adding athlete' });
  } finally {
    client.release();
  }
};

const deleteAthlete = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query(`DELETE FROM users_users 
        WHERE coach_id = $1 AND athlete_id = $2`,
         [req.body.coach, req.body.athlete]);
        res.json({status:'success', msg: 'Removed athlete'})
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "error", msg: "Error removing athlete" });
  } finally {
    client.release();
  }
};

const getActivityTypes = async(req, res) => {
    const client = await pool.connect();
    try {
    const {rows: sports} = await client.query(`SELECT * FROM activitytypes`)
    res.json(sports);
    }
    catch(error) {
        console.error(error.message);
        res.status(400).json({status: 'error', msg: 'Error retrieving activity types'})
    } finally {
        client.release();   
    }
}

const addActivity = async (req, res) => {
  const client = await pool.connect();
  try {
   await client.query(`INSERT INTO activities (athlete_id, coach_id, name, type, 
    date, duration, coach_comment) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [req.body.athlete_id,
        req.body.coach_id,
        req.body.name,
        req.body.type,
        req.body.date,
        req.body.duration,
        req.body.comment]
   );
   res.status(200).json({status: 'success', msg: 'successfully added activity'})
} catch (error) {
    console.error(error);
    res.status(400).json({ status: "error", msg: "" });
  } finally {
    client.release();
  }
};

const updateActivity = async (req, res) => {
    const client = await pool.connect();
    try {
     await client.query(`UPDATE activities SET name = $1, type = $2, date = $3, duration = $4, , coach_comment = $5 WHERE id = $6`,
      [req.body.name,
          req.body.type,
          req.body.date,
          req.body.duration,
          req.body.comment,
        req.params.id]
     );
     res.status(200).json({status: 'success', msg: 'successfully updated activity'})
  } catch (error) {
      console.error(error);
      res.status(400).json({ status: "error", msg: "" });
    } finally {
      client.release();
    }
  };
  

const deleteActivity = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query(`DELETE FROM activities WHERE id = $1`, [req.params.id]);
    res.status(200).json({status: 'success', msg: 'Deleted activity'})
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "error", msg: "Erroir deleting activity" });
  } finally {
    client.release();
  }
};

module.exports = {
getActivityTypes, 
  getProfile,
  addReview,
  updateProfilePicture,
  updateProfile,
  updateActivity,
  getActivities,
  commentOwnActivity,
  getOwnCoaches,
  getOwnAthletes,
  getCoaches,
  addActivity,
  addAthlete,
  deleteActivity,
  deleteAthlete,
};
