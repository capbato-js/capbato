import db from '../config/db.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res) => {
  const sql = 'SELECT id, full_name, role FROM users';
  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
};

export const createUser = async (req, res) => {
  const { full_name, username, password, role, email, phone } = req.body;
  if (!full_name || !username || !password || !role || !email) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    // Check for duplicate username/email
    const [existing] = await db.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (full_name, username, password, role, email, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, username, hashed, role, email, phone || null]
    );
    res.status(201).json({ message: 'Account created.' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
};

export const changeUserPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: 'Password updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
};
