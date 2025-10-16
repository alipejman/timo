const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authentication middleware with comprehensive logging
const authenticateToken = async (req, res, next) => {
  console.log('=== AUTHENTICATION MIDDLEWARE START ===');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  console.log('Request headers:', JSON.stringify(req.headers, null, 2));
  
  try {
    // Try Authorization header first
    let token = null;
    const authHeader = req.headers['authorization'];
    console.log('Authorization header:', authHeader);
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]; // Bearer TOKEN
      console.log('✅ Token found in Authorization header');
    } else {
      console.log('❌ No valid Authorization header, checking cookies...');
      
      // Try to get token from cookies
      const cookies = req.headers.cookie;
      console.log('Cookies:', cookies);
      
      if (cookies) {
        const tokenMatch = cookies.match(/token=([^;]+)/);
        if (tokenMatch) {
          token = tokenMatch[1];
          console.log('✅ Token found in cookies');
        } else {
          console.log('❌ No token found in cookies');
        }
      } else {
        console.log('❌ No cookies provided');
      }
    }
    
    console.log('Final token:', token ? 'exists' : 'missing');
    console.log('Token length:', token ? token.length : 0);
    console.log('Token starts with:', token ? token.substring(0, 20) + '...' : 'N/A');

    if (!token) {
      console.log('❌ No token found in Authorization header or cookies');
      return res.status(401).json({ error: 'Access token required' });
    }

    console.log('Verifying JWT token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ JWT token verified successfully');
    console.log('Decoded token payload:', decoded);
    
    console.log('Looking up user in database...');
    const user = await User.findById(decoded.userId).select('-password');
    console.log('User found:', user ? 'yes' : 'no');
    
    if (user) {
      console.log('User details:', {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      });
    }
    
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    console.log('✅ Authentication successful, proceeding to next middleware');
    console.log('=== AUTHENTICATION MIDDLEWARE END ===');
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      console.log('❌ Invalid JWT token');
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      console.log('❌ JWT token expired');
      return res.status(401).json({ error: 'Token expired' });
    }
    console.log('❌ Unexpected authentication error');
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = {
  authenticateToken,
  generateToken
};
