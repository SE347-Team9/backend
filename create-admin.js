require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const createUsers = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB');

    const usersToCreate = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: '123456',
        role: 'admin',
        status: 'active'
      },
      {
        username: 'staff1',
        email: 'staff1@example.com',
        password: '123456',
        role: 'staff',
        status: 'active'
      },
      {
        username: 'staff2',
        email: 'staff2@example.com',
        password: '123456',
        role: 'staff',
        status: 'active'
      }
    ];

    for (const userData of usersToCreate) {
      const existingUser = await User.findOne({ username: userData.username });
      if (existingUser) {
        console.log(`⏭️  User ${userData.username} đã tồn tại, bỏ qua`);
        continue;
      }

      const user = await User.create(userData);
      console.log(`✅ Đã tạo user ${userData.username} (${userData.role}) - ID: ${user._id}`);
    }

    console.log('\n📋 Danh sách tài khoản:');
    console.log('   Username: admin | Password: 123456 | Role: admin');
    console.log('   Username: staff1 | Password: 123456 | Role: staff');
    console.log('   Username: staff2 | Password: 123456 | Role: staff');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

createUsers();
