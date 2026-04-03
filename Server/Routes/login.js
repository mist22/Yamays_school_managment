// routes/auth.js
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pkg from "pg";

const router = express.Router();

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const userResult = await pool.query(
      'SELECT * FROM manager WHERE name = $1',
      [email]
    );

    const user = userResult.rows[0];
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // create JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // 1 hour expiry
    );

    // send token in JSON instead of cookie
    res.json({
      message: "Logged in successfully",
      token, // 👈 send token directly
      user: { id: user.id, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// TOKEN CHECK ROUTE (same)
import { authMiddleware } from './middleWare.js';
router.get('/check-token', authMiddleware, (req, res) => {
  res.json({
    isAuthenticated: true,
    user: req.user
  });
});

export default router;