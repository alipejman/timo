const express = require('express');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;

    // Validation
    if (!firstName || !lastName || !username || !password) {
      return res.status(400).json({ error: 'تمام فیلدها الزامی است' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'رمز عبور باید حداقل 6 کاراکتر باشد' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'نام کاربری باید حداقل 3 کاراکتر باشد' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'نام کاربری قبلاً استفاده شده است' });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      username,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'کاربر با موفقیت ثبت شد',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'ثبت نام ناموفق بود' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'نام کاربری و رمز عبور الزامی است' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'ورود موفقیت‌آمیز',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'ورود ناموفق بود' });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

module.exports = router;
