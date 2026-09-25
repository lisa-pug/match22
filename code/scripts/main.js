const express = require('express');
const path = require('path');
const app = express();
const pool = require('./db');
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 3000;

app.use(express.json()); 

// Serve everything in code/public/ (HTML, CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// sign up stuff
app.post('/api/signup', async (req, res) => {
  const { username, password, dob } = req.body;

  try {
    // check username doesn't already exist
    const existing = await pool.query('SELECT * FROM users WHERE username = $1', [username]); // $1 prevents sql injects :)
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Username taken or account already exists' });
    }
    // create account
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, dob) VALUES ($1, $2, $3) RETURNING userid, username',
      [username, password_hash, dob]
    );
    res.json(result.rows[0]);
    // NEED TO AUTHENTICATE USER
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});