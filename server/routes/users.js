const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/database');

const router = express.Router();

// Create user profile (onboarding)
router.post('/profile', async (req, res) => {
  try {
    const { weight, unit, dailyGoal, reminderStart, reminderEnd } = req.body;
    
    const result = await db.query(
      `INSERT INTO users (weight, weight_unit, daily_goal, reminder_start, reminder_end, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id, weight, weight_unit, daily_goal, reminder_start, reminder_end`,
      [weight, unit, dailyGoal, reminderStart, reminderEnd]
    );

    res.status(201).json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'SELECT id, weight, weight_unit, daily_goal, reminder_start, reminder_end FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { weight, unit, dailyGoal, reminderStart, reminderEnd } = req.body;
    
    const result = await db.query(
      `UPDATE users 
       SET weight = $1, weight_unit = $2, daily_goal = $3, 
           reminder_start = $4, reminder_end = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING id, weight, weight_unit, daily_goal, reminder_start, reminder_end`,
      [weight, unit, dailyGoal, reminderStart, reminderEnd, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
