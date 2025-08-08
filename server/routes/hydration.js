const express = require('express');
const db = require('../models/database');

const router = express.Router();

// Log water intake
router.post('/log', async (req, res) => {
  try {
    const { userId, amount, timestamp } = req.body;
    
    const result = await db.query(
      `INSERT INTO hydration_logs (user_id, amount, logged_at)
       VALUES ($1, $2, $3)
       RETURNING id, amount, logged_at`,
      [userId, amount, timestamp || new Date()]
    );

    res.status(201).json({
      success: true,
      log: result.rows[0]
    });
  } catch (error) {
    console.error('Error logging hydration:', error);
    res.status(500).json({ error: 'Failed to log hydration' });
  }
});

// Get daily intake
router.get('/daily/:userId/:date?', async (req, res) => {
  try {
    const { userId, date } = req.params;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const result = await db.query(
      `SELECT SUM(amount) as total_intake, COUNT(*) as sip_count
       FROM hydration_logs 
       WHERE user_id = $1 AND DATE(logged_at) = $2`,
      [userId, targetDate]
    );

    const dailyStats = result.rows[0];
    
    res.json({
      success: true,
      date: targetDate,
      totalIntake: parseInt(dailyStats.total_intake) || 0,
      sipCount: parseInt(dailyStats.sip_count) || 0
    });
  } catch (error) {
    console.error('Error fetching daily intake:', error);
    res.status(500).json({ error: 'Failed to fetch daily intake' });
  }
});

// Get weekly stats
router.get('/weekly/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await db.query(
      `SELECT DATE(logged_at) as date, SUM(amount) as total_intake
       FROM hydration_logs 
       WHERE user_id = $1 AND logged_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(logged_at)
       ORDER BY date DESC`,
      [userId]
    );

    res.json({
      success: true,
      weeklyData: result.rows
    });
  } catch (error) {
    console.error('Error fetching weekly stats:', error);
    res.status(500).json({ error: 'Failed to fetch weekly stats' });
  }
});

// Get user streak
router.get('/streak/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's daily goal
    const userResult = await db.query(
      'SELECT daily_goal FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const dailyGoal = userResult.rows[0].daily_goal;
    
    // Calculate streak (simplified - consecutive days meeting goal)
    const streakResult = await db.query(
      `WITH daily_totals AS (
         SELECT DATE(logged_at) as date, SUM(amount) as daily_total
         FROM hydration_logs 
         WHERE user_id = $1
         GROUP BY DATE(logged_at)
         HAVING SUM(amount) >= $2
         ORDER BY date DESC
       ),
       streak_calc AS (
         SELECT date, 
                ROW_NUMBER() OVER (ORDER BY date DESC) as rn,
                date - INTERVAL '1 day' * (ROW_NUMBER() OVER (ORDER BY date DESC) - 1) as streak_date
         FROM daily_totals
       )
       SELECT COUNT(*) as streak
       FROM streak_calc
       WHERE streak_date = (SELECT MAX(streak_date) FROM streak_calc)`,
      [userId, dailyGoal]
    );

    res.json({
      success: true,
      streak: parseInt(streakResult.rows[0]?.streak) || 0
    });
  } catch (error) {
    console.error('Error calculating streak:', error);
    res.status(500).json({ error: 'Failed to calculate streak' });
  }
});

module.exports = router;