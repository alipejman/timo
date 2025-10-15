# راهنمای اتصال MongoDB به پروژه Timo

## 1. نصب MongoDB

### گزینه 1: MongoDB محلی
```bash
# Windows (با Chocolatey)
choco install mongodb

# یا دانلود از سایت رسمی MongoDB
```

### گزینه 2: MongoDB Atlas (رایگان)
1. به [MongoDB Atlas](https://www.mongodb.com/atlas) بروید
2. حساب کاربری ایجاد کنید
3. یک cluster رایگان بسازید
4. Connection string را کپی کنید

## 2. تنظیم متغیرهای محیطی

فایل `.env` را در ریشه پروژه ایجاد کنید:

```env
# برای MongoDB محلی
MONGODB_URI=mongodb://localhost:27017/timo

# برای MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/timo?retryWrites=true&w=majority

# پورت سرور
PORT=3000
```

## 3. ساختار فایل‌های کانفیگ

```
Timo/
├── config/
│   └── database.js          # کانفیگ اتصال MongoDB
├── models/
│   ├── Task.js             # مدل تسک‌ها
│   └── Timer.js            # مدل تایمرها
├── routes/
│   └── api.js              # API routes
├── .env                    # متغیرهای محیطی (ایجاد کنید)
└── server.js               # فایل اصلی سرور
```

## 4. API Endpoints

### Tasks
- `GET /api/tasks` - دریافت همه تسک‌ها
- `POST /api/tasks` - ایجاد تسک جدید
- `PUT /api/tasks/:id` - به‌روزرسانی تسک
- `DELETE /api/tasks/:id` - حذف تسک

### Timers
- `GET /api/timers` - دریافت تاریخچه تایمرها
- `POST /api/timers` - ذخیره جلسه تایمر

## 5. اجرای پروژه

```bash
# نصب dependencies
npm install

# اجرای سرور
npm start
```

## 6. تست اتصال

پس از اجرای سرور، باید پیام زیر را ببینید:
```
MongoDB متصل شد: localhost
Timo running on http://localhost:3000
```
