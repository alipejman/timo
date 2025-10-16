// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/database');

const app = express();
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

// استاتیک‌ها از /public (HTML ها no-cache؛ بقیه کش بلندمدت)
app.use(express.static(PUBLIC_DIR, {
  etag: true,
  maxAge: '1y',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else if (filePath.endsWith('.js')) {
      // JavaScript files should also not be cached to ensure updates are loaded
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// خیلی مهم: SW همیشه بدون کش بیاید تا گیر نکند
app.get('/sw.js', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.sendFile(path.join(PUBLIC_DIR, 'sw.js'));
});

// Handle favicon requests
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'favicon-32.png'));
});

// صفحهٔ اصلی - redirect to login
app.get('/', (req, res) => {
  res.redirect('/login.html?v=' + Date.now());
});

// Add version parameter to all HTML routes to force reload
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'login.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'register.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.get('/mood.html', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'mood.html'));
});

app.get('/checklist.html', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'checklist.html'));
});

app.get('/pomodoro.html', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'pomodoro.html'));
});

// APIهایت قبلاً کار می‌کنند؛ نیازی به تغییر نیست

// اتصال به دیتابیس
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Timo running on http://localhost:${PORT}`);
});
