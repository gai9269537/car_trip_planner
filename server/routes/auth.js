import express from 'express';
import { randomUUID } from 'crypto';
import { getDatabase } from '../database/db.js';

export const router = express.Router();

// Login or create user
router.post('/login', (req, res) => {
  try {
    const { name, email, profilePictureUrl } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const db = getDatabase();
    
    // Check if user exists
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      // Create new user
      const userId = randomUUID();
      db.prepare(`
        INSERT INTO users (id, name, email, profile_picture_url)
        VALUES (?, ?, ?, ?)
      `).run(userId, name, email, profilePictureUrl || null);
      
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    } else {
      // Update user if name changed
      db.prepare(`
        UPDATE users 
        SET name = ?, profile_picture_url = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(name, profilePictureUrl || null, user.id);
      
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      profilePictureUrl: user.profile_picture_url,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get user by ID
router.get('/user/:id', (req, res) => {
  try {
    const db = getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      profilePictureUrl: user.profile_picture_url,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

