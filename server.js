// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/database');

const app = express();
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(express.json());

// API Routes
app.use('/api', require('./routes/api'));

// استاتیک‌ها از /public (HTML ها no-cache؛ بقیه کش بلندمدت)
app.use(express.static(PUBLIC_DIR, {
  etag: true,
  maxAge: '1y',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// خیلی مهم: SW همیشه بدون کش بیاید تا گیر نکند
app.get('/sw.js', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.sendFile(path.join(PUBLIC_DIR, 'sw.js'));
});

// صفحهٔ اصلی
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// APIهایت قبلاً کار می‌کنند؛ نیازی به تغییر نیست

// اتصال به دیتابیس
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Timo running on http://localhost:${PORT}`);
});
