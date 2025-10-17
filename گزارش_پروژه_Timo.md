# گزارش جامع پروژه Timo - سیستم مدیریت بهره‌وری و تایمر پومودورو

## 📋 خلاصه پروژه

**Timo** یک اپلیکیشن وب پیشرفته برای مدیریت بهره‌وری است که شامل تایمر پومودورو، ردیاب حالت روحی، و سیستم مدیریت کارهای روزانه می‌باشد. این پروژه با استفاده از تکنولوژی‌های مدرن وب و معماری RESTful API طراحی شده است.

## 🏗️ معماری کلی سیستم

### 1. **معماری Backend (سرور)**
- **فریمورک**: Node.js + Express.js
- **پایگاه داده**: MongoDB با Mongoose ODM
- **احراز هویت**: JWT (JSON Web Tokens)
- **رمزنگاری**: bcryptjs برای هش کردن پسوردها
- **پورت**: 3000 (قابل تنظیم از متغیر محیطی)

### 2. **معماری Frontend (کلاینت)**
- **تکنولوژی**: Vanilla JavaScript + HTML5 + CSS3
- **فریمورک CSS**: Bootstrap 5.3.3
- **فونت**: Vazirmatn (فونت فارسی)
- **تقویم**: Jalali Moment.js (تقویم شمسی)
- **طراحی**: Responsive Design + PWA

### 3. **معماری PWA (Progressive Web App)**
- **Service Worker**: کش هوشمند برای فایل‌های استاتیک
- **Manifest**: پشتیبانی از نصب روی دستگاه‌های موبایل
- **Cache Strategy**: Cache-First برای استاتیک‌ها، Stale-While-Revalidate برای APIها

## 🗄️ مدل‌های پایگاه داده

### 1. **مدل User (کاربر)**
```javascript
{
  firstName: String (حداکثر 50 کاراکتر),
  lastName: String (حداکثر 50 کاراکتر),
  username: String (منحصر به فرد، 3-30 کاراکتر),
  password: String (حداقل 6 کاراکتر، هش شده),
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **مدل Timer (تایمر)**
```javascript
{
  user: ObjectId (مرجع به User),
  sessionType: Enum ['work', 'break', 'longBreak'],
  duration: Number (ثانیه),
  date: String (تاریخ شمسی),
  completedAt: Date,
  notes: String,
  tags: [String]
}
```

### 3. **مدل Mood (حالت روحی)**
```javascript
{
  user: ObjectId,
  date: String (تاریخ شمسی),
  mood: Enum ['very-happy', 'happy', 'neutral', 'sad', 'very-sad'],
  note: String (حداکثر 500 کاراکتر),
  activities: [String],
  energy: Number (1-10),
  sleep: {
    hours: Number (0-24),
    quality: Enum ['excellent', 'good', 'fair', 'poor']
  }
}
```

### 4. **مدل Checklist (چک‌لیست)**
```javascript
{
  user: ObjectId,
  date: String (تاریخ شمسی),
  items: [{
    text: String,
    completed: Boolean,
    createdAt: Date
  }]
}
```

## 🔐 سیستم احراز هویت

### **ویژگی‌های امنیتی:**
- **JWT Tokens**: اعتبارسنجی با توکن‌های 7 روزه
- **Password Hashing**: استفاده از bcrypt با salt
- **Middleware Authentication**: بررسی خودکار در تمام APIها
- **Cookie + localStorage**: ذخیره دوگانه برای سازگاری
- **CORS Support**: پشتیبانی از درخواست‌های cross-origin

### **API های احراز هویت:**
- `POST /api/auth/register` - ثبت نام کاربر جدید
- `POST /api/auth/login` - ورود کاربر
- `GET /api/auth/profile` - دریافت پروفایل کاربر

## 🚀 API Endpoints

### **Timer APIs:**
- `GET /api/timer?date=YYYY/MM/DD` - آمار تایمر روزانه
- `POST /api/timer/addSeconds` - اضافه کردن ثانیه به تایمر
- `GET /api/timer/range?from=...&to=...` - آمار بازه زمانی
- `POST /api/timer/save` - ذخیره جلسه تایمر

### **Mood APIs:**
- `GET /api/mood?date=YYYY/MM/DD` - دریافت حالت روزانه
- `POST /api/mood/save` - ذخیره حالت روحی
- `GET /api/mood/range?from=...&to=...` - آمار بازه زمانی

### **Checklist APIs:**
- `GET /api/checklist?date=YYYY/MM/DD` - دریافت چک‌لیست روزانه
- `POST /api/checklist/save` - ذخیره چک‌لیست
- `PUT /api/checklist/item/:id` - به‌روزرسانی آیتم

## 🎨 ویژگی‌های Frontend

### **1. Dashboard (صفحه اصلی)**
- نمایش آمار روزانه (تایمر، حالت، کارهای باقی‌مانده)
- طراحی کارت‌های تعاملی
- پشتیبانی کامل از موبایل
- کش هوشمند برای بهبود عملکرد

### **2. Pomodoro Timer**
- تایمر 25 دقیقه‌ای با استراحت
- ذخیره خودکار جلسات
- نمایش آمار روزانه
- پشتیبانی از انواع جلسات (کار، استراحت، استراحت طولانی)

### **3. Mood Tracker**
- ثبت حالت روحی روزانه (5 سطح)
- ثبت انرژی (1-10)
- ثبت کیفیت خواب
- نمودار آمار 7 روزه
- یادداشت‌های شخصی

### **4. Checklist Manager**
- ایجاد و مدیریت کارهای روزانه
- تیک زدن کارهای انجام شده
- نمایش درصد پیشرفت
- ذخیره خودکار

## 🛠️ تکنولوژی‌های استفاده شده

### **Backend Stack:**
- **Node.js** (Runtime Environment)
- **Express.js** (Web Framework)
- **MongoDB** (NoSQL Database)
- **Mongoose** (ODM)
- **JWT** (Authentication)
- **bcryptjs** (Password Hashing)
- **CORS** (Cross-Origin Support)

### **Frontend Stack:**
- **Vanilla JavaScript** (No Framework)
- **Bootstrap 5.3.3** (CSS Framework)
- **Jalali Moment.js** (Persian Calendar)
- **PWA** (Progressive Web App)
- **Service Worker** (Caching)

### **Development Tools:**
- **dotenv** (Environment Variables)
- **ES6+ Features** (Modern JavaScript)
- **Responsive Design** (Mobile-First)

## 📱 ویژگی‌های PWA

### **Service Worker:**
- کش هوشمند فایل‌های استاتیک
- استراتژی Cache-First برای منابع
- استراتژی Stale-While-Revalidate برای APIها
- پشتیبانی از Offline Mode

### **Manifest:**
- قابلیت نصب روی دستگاه‌های موبایل
- آیکون‌های مختلف سایز
- تنظیمات رنگ و تم

## 🚀 استقرار (Deployment)

### **پشتیبانی از پلتفرم‌های مختلف:**
- **Liara** (پلتفرم ایرانی)
- **Back4App** (پلتفرم بین‌المللی)
- **Docker** (کانتینری‌سازی)

### **تنظیمات محیط:**
- متغیرهای محیطی برای MongoDB URI
- تنظیمات پورت
- تنظیمات JWT Secret

## 📊 ویژگی‌های کلیدی

### **1. تقویم شمسی:**
- استفاده از Jalali Moment.js
- نمایش تاریخ‌های شمسی در تمام بخش‌ها
- سازگاری با تقویم ایرانی

### **2. طراحی Responsive:**
- پشتیبانی کامل از موبایل
- طراحی Mobile-First
- سازگاری با تمام سایزهای صفحه

### **3. کش هوشمند:**
- کش فایل‌های HTML و JS
- کش منابع استاتیک
- به‌روزرسانی خودکار

### **4. امنیت:**
- احراز هویت JWT
- هش کردن پسوردها
- محافظت از APIها
- CORS Configuration

## 🔧 ساختار فایل‌ها

```
timo/
├── config/
│   └── database.js          # تنظیمات MongoDB
├── middleware/
│   └── auth.js             # احراز هویت JWT
├── models/
│   ├── User.js             # مدل کاربر
│   ├── Timer.js            # مدل تایمر
│   ├── Mood.js             # مدل حالت روحی
│   └── Checklist.js        # مدل چک‌لیست
├── routes/
│   ├── auth.js             # API های احراز هویت
│   └── api.js              # API های اصلی
├── public/
│   ├── index.html          # داشبورد اصلی
│   ├── pomodoro.html       # صفحه تایمر
│   ├── mood.html            # صفحه ردیاب حالت
│   ├── checklist.html      # صفحه چک‌لیست
│   ├── js/
│   │   └── auth.js         # احراز هویت کلاینت
│   ├── manifest.json       # تنظیمات PWA
│   └── sw.js               # Service Worker
├── server.js               # فایل اصلی سرور
├── package.json            # وابستگی‌ها
└── liara.json              # تنظیمات استقرار
```

## 🎯 اهداف پروژه

### **اهداف اصلی:**
1. **مدیریت زمان**: تایمر پومودورو برای تمرکز بهتر
2. **ردیابی سلامت روان**: ثبت حالت روحی روزانه
3. **مدیریت کارها**: چک‌لیست کارهای روزانه
4. **آمارگیری**: نمایش پیشرفت و آمار

### **مزایای فنی:**
- **Performance**: کش هوشمند و بهینه‌سازی
- **Security**: احراز هویت و رمزنگاری
- **Scalability**: معماری RESTful و ماژولار
- **User Experience**: طراحی کاربرپسند و Responsive

## 📈 قابلیت‌های آینده

### **بهبودهای پیشنهادی:**
1. **نوتیفیکیشن**: یادآوری تایمر و کارها
2. **گزارش‌گیری**: نمودارهای پیشرفته‌تر
3. **همگام‌سازی**: پشتیبانی از چند دستگاه
4. **تم‌های مختلف**: پشتیبانی از تم‌های مختلف
5. **API عمومی**: امکان یکپارچه‌سازی با اپلیکیشن‌های دیگر

## 🔍 جزئیات فنی پیشرفته

### **سیستم کش:**
- **HTML Files**: no-cache برای به‌روزرسانی فوری
- **JavaScript Files**: no-cache برای جلوگیری از مشکلات
- **Static Assets**: کش 1 ساله برای بهینه‌سازی
- **Service Worker**: مدیریت هوشمند کش

### **مدیریت خطا:**
- **Try-Catch Blocks**: مدیریت خطا در تمام APIها
- **Error Logging**: لاگ‌گیری کامل برای دیباگ
- **Graceful Degradation**: عملکرد در صورت خطا
- **User Feedback**: پیام‌های خطای کاربرپسند

### **بهینه‌سازی عملکرد:**
- **Database Indexing**: ایندکس روی فیلدهای پرکاربرد
- **Query Optimization**: بهینه‌سازی کوئری‌های MongoDB
- **Response Caching**: کش پاسخ‌های API
- **Bundle Optimization**: بهینه‌سازی فایل‌های استاتیک

## 📱 ویژگی‌های موبایل

### **Responsive Design:**
- **Mobile-First Approach**: طراحی اول برای موبایل
- **Touch-Friendly**: دکمه‌ها و المان‌های لمسی
- **Gesture Support**: پشتیبانی از حرکات لمسی
- **Offline Support**: عملکرد بدون اینترنت

### **PWA Features:**
- **Install Prompt**: پیشنهاد نصب اپلیکیشن
- **App Shell**: ساختار اصلی اپلیکیشن
- **Background Sync**: همگام‌سازی در پس‌زمینه
- **Push Notifications**: نوتیفیکیشن‌های فشاری

## 🔒 امنیت و حریم خصوصی

### **احراز هویت:**
- **JWT Security**: توکن‌های امن و منقضی‌شونده
- **Password Policy**: قوانین قوی برای پسورد
- **Session Management**: مدیریت جلسات کاربر
- **Rate Limiting**: محدودیت درخواست‌ها

### **حفاظت از داده:**
- **Data Encryption**: رمزنگاری داده‌های حساس
- **Input Validation**: اعتبارسنجی ورودی‌ها
- **SQL Injection Prevention**: جلوگیری از تزریق کد
- **XSS Protection**: محافظت از حملات XSS

## 📊 آمار و گزارش‌گیری

### **آمار تایمر:**
- زمان مطالعه روزانه
- تعداد جلسات پومودورو
- آمار بازه زمانی
- نمودار پیشرفت

### **آمار حالت روحی:**
- روند تغییرات حالت
- آمار انرژی روزانه
- کیفیت خواب
- نمودار 7 روزه

### **آمار کارها:**
- درصد تکمیل کارها
- تعداد کارهای انجام شده
- آمار بازه زمانی
- نمودار پیشرفت

## 🚀 دستورالعمل نصب و راه‌اندازی

### **پیش‌نیازها:**
- Node.js 18+
- MongoDB Atlas یا MongoDB محلی
- Git

### **مراحل نصب:**
1. کلون کردن ریپوزیتوری
2. نصب وابستگی‌ها با `npm install`
3. تنظیم متغیرهای محیطی
4. اجرای سرور با `npm start`
5. دسترسی به `http://localhost:3000`

### **تنظیمات محیط:**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
NODE_ENV=production
```

## 🎨 طراحی و تجربه کاربری

### **اصول طراحی:**
- **Minimalism**: طراحی ساده و تمیز
- **Consistency**: ثبات در تمام صفحات
- **Accessibility**: دسترسی‌پذیری برای همه
- **Performance**: سرعت بالا و پاسخگویی

### **رنگ‌بندی:**
- **Primary**: #f6d365 (زرد طلایی)
- **Secondary**: #fda085 (نارنجی)
- **Text**: #2d2d2d (مشکی)
- **Background**: گرادیان زرد به نارنجی

### **تایپوگرافی:**
- **Font Family**: Vazirmatn
- **Weights**: 400 (Regular), 700 (Bold)
- **Sizes**: Responsive scaling
- **RTL Support**: پشتیبانی کامل از راست به چپ

## 🔧 نگهداری و پشتیبانی

### **مانیتورینگ:**
- **Error Tracking**: ردیابی خطاها
- **Performance Monitoring**: نظارت بر عملکرد
- **User Analytics**: آمار استفاده کاربران
- **Database Monitoring**: نظارت بر پایگاه داده

### **به‌روزرسانی:**
- **Version Control**: مدیریت نسخه‌ها
- **Dependency Updates**: به‌روزرسانی وابستگی‌ها
- **Security Patches**: وصله‌های امنیتی
- **Feature Updates**: به‌روزرسانی ویژگی‌ها

---

**نتیجه‌گیری:**
این پروژه نمونه‌ای کامل از یک اپلیکیشن وب مدرن با معماری RESTful، احراز هویت امن، و طراحی کاربرپسند است که می‌تواند به عنوان پایه‌ای برای پروژه‌های بزرگ‌تر استفاده شود. استفاده از تکنولوژی‌های مدرن، طراحی Responsive، و پشتیبانی از PWA آن را به یک راه‌حل جامع برای مدیریت بهره‌وری تبدیل کرده است.
