const mongoose = require('mongoose');

// کانفیگ اتصال به MongoDB
const connectDB = async () => {
  try {
    // استفاده از متغیر محیطی یا URL پیش‌فرض
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/timo';
    
    console.log('🔄 در حال اتصال به MongoDB...');
    console.log('📍 URI:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // مخفی کردن پسورد
    
    const conn = await mongoose.connect(mongoURI);

    console.log('✅ MongoDB متصل شد:');
    console.log(`   🏠 Host: ${conn.connection.host}`);
    console.log(`   🗄️  Database: ${conn.connection.name}`);
    console.log(`   🔌 Port: ${conn.connection.port}`);
    console.log(`   📊 Ready State: ${conn.connection.readyState} (1=connected)`);
  } catch (error) {
    console.error('❌ خطا در اتصال به MongoDB:');
    console.error('   📝 Error:', error.message);
    console.error('   🔍 Code:', error.code);
    process.exit(1);
  }
};

module.exports = connectDB;
