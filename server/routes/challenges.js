const express = require('express');
const db = require('../models/database');

const router = express.Router();

// Get all active challenges
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, description, type, target_value, reward_xp, badge_icon, is_active
       FROM challenges 
       WHERE is_active = true 
       ORDER BY type, reward_xp DESC`
    );

    res.json({
      success: true,
      challenges: result.rows
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch challenges' 
    });
  }
});

// Get challenges by type
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['daily', 'weekly', 'monthly'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid challenge type'
      });
    }

    const result = await db.query(
      `SELECT id, name, description, type, target_value, reward_xp, badge_icon
       FROM challenges 
       WHERE type = $1 AND is_active = true 
       ORDER BY reward_xp DESC`,
      [type]
    );

    res.json({
      success: true,
      challenges: result.rows
    });
  } catch (error) {
    console.error('Error fetching challenges by type:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch challenges' 
    });
  }
});

// Join a challenge
router.post('/:challengeId/join', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Check if challenge exists
    const challengeCheck = await db.query(
      'SELECT id FROM challenges WHERE id = $1 AND is_active = true',
      [challengeId]
    );

    if (challengeCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Insert or update user challenge participation
    const result = await db.query(
      `INSERT INTO user_challenges (user_id, challenge_id, progress, started_at)
       VALUES ($1, $2, 0, NOW())
       ON CONFLICT (user_id, challenge_id) 
       DO UPDATE SET started_at = NOW(), completed = false, progress = 0
       RETURNING id, progress, started_at`,
      [userId, challengeId]
    );

    res.status(201).json({
      success: true,
      userChallenge: result.rows[0]
    });
  } catch (error) {
    console.error('Error joining challenge:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to join challenge' 
    });
  }
});

// Get user's active challenges
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await db.query(
      `SELECT c.id, c.name, c.description, c.type, c.target_value, c.reward_xp, c.badge_icon,
              uc.progress, uc.completed, uc.started_at, uc.completed_at
       FROM challenges c
       JOIN user_challenges uc ON c.id = uc.challenge_id
       WHERE uc.user_id = $1 AND c.is_active = true
       ORDER BY uc.started_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      userChallenges: result.rows
    });
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch user challenges' 
    });
  }
});

// Update challenge progress
router.put('/:challengeId/progress', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { userId, progress } = req.body;

    if (!userId || progress === undefined) {
      return res.status(400).json({
        success: false,
        error: 'User ID and progress are required'
      });
    }

    // Get challenge target to check completion
    const challengeInfo = await db.query(
      'SELECT target_value FROM challenges WHERE id = $1',
      [challengeId]
    );

    if (challengeInfo.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    const targetValue = challengeInfo.rows[0].target_value;
    const isCompleted = progress >= targetValue;

    const result = await db.query(
      `UPDATE user_challenges 
       SET progress = $1, completed = $2, completed_at = $3
       WHERE user_id = $4 AND challenge_id = $5
       RETURNING id, progress, completed, completed_at`,
      [progress, isCompleted, isCompleted ? new Date() : null, userId, challengeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User challenge not found'
      });
    }

    res.json({
      success: true,
      userChallenge: result.rows[0],
      completed: isCompleted
    });
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update challenge progress' 
    });
  }
});

module.exports = router;
