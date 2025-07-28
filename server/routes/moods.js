const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create mood entry
router.post('/', [
  body('mood').isIn(['Happy', 'Sad', 'Angry', 'Okay']).withMessage('Invalid mood selection'),
  body('note').optional().isLength({ max: 150 }).withMessage('Note must be 150 characters or less')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mood, note } = req.body;
    const userId = req.user.userId;

    // Check if user already logged mood today
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = await pool.query(
      'SELECT * FROM mood_entries WHERE user_id = $1 AND DATE(created_at) = $2',
      [userId, today]
    );

    if (existingEntry.rows.length > 0) {
      return res.status(400).json({ error: 'You have already logged your mood for today. You can edit your existing entry.' });
    }

    const result = await pool.query(
      'INSERT INTO mood_entries (user_id, mood, note) VALUES ($1, $2, $3) RETURNING *',
      [userId, mood, note || null]
    );

    res.status(201).json({
      message: 'Mood entry created successfully',
      entry: result.rows[0]
    });
  } catch (error) {
    console.error('Create mood entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's mood entries
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      'SELECT * FROM mood_entries WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM mood_entries WHERE user_id = $1',
      [userId]
    );

    res.json({
      entries: result.rows,
      totalCount: parseInt(countResult.rows[0].count),
      currentPage: page,
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (error) {
    console.error('Get mood entries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get mood analytics for the past 7 days
router.get('/analytics', async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await pool.query(`
      SELECT 
        mood,
        COUNT(*) as count
      FROM mood_entries 
      WHERE user_id = $1 
        AND created_at >= NOW() - INTERVAL '7 days'
      GROUP BY mood
      ORDER BY count DESC
    `, [userId]);

    // Ensure all moods are represented with 0 counts if not present
    const moodCounts = { Happy: 0, Sad: 0, Angry: 0, Okay: 0 };
    result.rows.forEach(row => {
      moodCounts[row.mood] = parseInt(row.count);
    });

    res.json({ moodCounts });
  } catch (error) {
    console.error('Get mood analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update mood entry
router.put('/:id', [
  body('mood').isIn(['Happy', 'Sad', 'Angry', 'Okay']).withMessage('Invalid mood selection'),
  body('note').optional().isLength({ max: 150 }).withMessage('Note must be 150 characters or less')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { mood, note } = req.body;
    const userId = req.user.userId;

    // Check if entry exists and belongs to user
    const existingEntry = await pool.query(
      'SELECT * FROM mood_entries WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingEntry.rows.length === 0) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    const result = await pool.query(
      'UPDATE mood_entries SET mood = $1, note = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
      [mood, note || null, id, userId]
    );

    res.json({
      message: 'Mood entry updated successfully',
      entry: result.rows[0]
    });
  } catch (error) {
    console.error('Update mood entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete mood entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if entry exists and belongs to user
    const existingEntry = await pool.query(
      'SELECT * FROM mood_entries WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingEntry.rows.length === 0) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    await pool.query(
      'DELETE FROM mood_entries WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    res.json({ message: 'Mood entry deleted successfully' });
  } catch (error) {
    console.error('Delete mood entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;