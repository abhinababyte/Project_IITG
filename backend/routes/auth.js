const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, hostel } = req.body;
    
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }
    
    // 2. Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    // 3. Create the user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        hostel
      }
    });
    
    // 4. Generate JWT Token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // 5. Respond with token and user data (excluding password)
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        hostel: user.hostel, 
        eco_coins: user.eco_coins 
      } 
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: 'Internal server error during signup.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    
    // 2. Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    
    // 3. Generate JWT Token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        hostel: user.hostel, 
        eco_coins: user.eco_coins 
      } 
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

module.exports = router;
