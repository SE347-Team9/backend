const mongoose = require('mongoose');
require('dotenv').config();

// Models
const User = require('./src/models/User');
const Report = require('./src/models/Report');
const Regulation = require('./src/models/Regulation');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/se347_agency_management');
    console.log('✓ Đã kết nối MongoDB');

    // Tìm admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('✗ Không tìm thấy admin user. Vui lòng tạo admin trước.');
      process.exit(1);
    }
    console.log(`✓ Tìm thấy admin: ${admin.username}`);

    // Xóa dữ liệu cũ
    await Report.deleteMany({});
    await Regulation.deleteMany({});
    console.log('✓ Đã xóa dữ liệu cũ');

    // Tạo báo cáo mẫu
    const sampleReports = [
      {
        title: 'Báo cáo doanh thu tháng 10/2024',
        type: 'monthly',
        month: 10,
        year: 2024,
        data: {
          totalRevenue: 2430000,
          agencies: [
            { code: 'DL1', name: 'Đại lý Nghĩa', revenue: 1530000 },
            { code: 'DL2', name: 'Đại lý Đại', revenue: 900000 }
          ]
        },
        summary: 'Tổng doanh thu tháng 10: 2,430,000 VNĐ',
        createdBy: admin._id,
        status: 'published'
      },
      {
        title: 'Báo cáo công nợ tháng 10/2024',
        type: 'monthly',
        month: 10,
        year: 2024,
        data: {
          totalDebt: 36460000,
          agencies: [
            { code: 'DL1', name: 'Đại lý Nghĩa', debt: 24060000 },
            { code: 'DL2', name: 'Đại lý Đại', debt: 12400000 }
          ]
        },
        summary: 'Tổng công nợ tháng 10: 36,460,000 VNĐ',
        createdBy: admin._id,
        status: 'published'
      },
      {
        title: 'Báo cáo doanh thu tháng 11/2024',
        type: 'monthly',
        month: 11,
        year: 2024,
        data: {
          totalRevenue: 3200000,
          agencies: [
            { code: 'DL1', name: 'Đại lý Nghĩa', revenue: 1800000 },
            { code: 'DL2', name: 'Đại lý Đại', revenue: 1400000 }
          ]
        },
        summary: 'Tổng doanh thu tháng 11: 3,200,000 VNĐ',
        createdBy: admin._id,
        status: 'published'
      },
      {
        title: 'Báo cáo quý 3/2024',
        type: 'quarterly',
        year: 2024,
        data: {
          totalRevenue: 7200000,
          totalDebt: 45000000
        },
        summary: 'Báo cáo tổng hợp quý 3 năm 2024',
        createdBy: admin._id,
        status: 'published'
      }
    ];

    const reports = await Report.insertMany(sampleReports);
    console.log(`✓ Đã tạo ${reports.length} báo cáo`);

    // Tạo quy định mẫu
    const sampleRegulations = [
      {
        code: 'max_debt_level_1',
        title: 'Trần nợ đại lý cấp 1',
        content: 'Đại lý cấp 1 được phép nợ tối đa 100,000,000 VNĐ',
        type: 'financial',
        value: 100000000,
        unit: 'VNĐ',
        status: 'active',
        effectiveDate: new Date('2024-01-01'),
        updatedBy: admin._id
      },
      {
        code: 'max_debt_level_2',
        title: 'Trần nợ đại lý cấp 2',
        content: 'Đại lý cấp 2 được phép nợ tối đa 50,000,000 VNĐ',
        type: 'financial',
        value: 50000000,
        unit: 'VNĐ',
        status: 'active',
        effectiveDate: new Date('2024-01-01'),
        updatedBy: admin._id
      },
      {
        code: 'max_delivery_order',
        title: 'Số lượng đơn hàng tối đa',
        content: 'Mỗi đại lý chỉ được đặt tối đa 10 đơn hàng mỗi ngày',
        type: 'agency',
        value: 10,
        unit: 'đơn/ngày',
        status: 'active',
        effectiveDate: new Date('2024-06-01'),
        updatedBy: admin._id
      },
      {
        code: 'min_order_value',
        title: 'Giá trị đơn hàng tối thiểu',
        content: 'Đơn hàng phải có giá trị tối thiểu 5,000,000 VNĐ',
        type: 'financial',
        value: 5000000,
        unit: 'VNĐ',
        status: 'active',
        effectiveDate: new Date('2024-10-01'),
        updatedBy: admin._id
      },
      {
        code: 'product_warranty',
        title: 'Thời gian bảo hành sản phẩm',
        content: 'Tất cả sản phẩm được bảo hành 12 tháng kể từ ngày mua',
        type: 'product',
        value: 12,
        unit: 'tháng',
        status: 'active',
        effectiveDate: new Date('2024-01-01'),
        updatedBy: admin._id
      }
    ];

    const regulations = await Regulation.insertMany(sampleRegulations);
    console.log(`✓ Đã tạo ${regulations.length} quy định`);

    // Hiển thị kết quả
    console.log('\n📊 DANH SÁCH BÁO CÁO:');
    reports.forEach((r, i) => {
      console.log(`${i + 1}. ${r.title} (${r.type})`);
    });

    console.log('\n📋 DANH SÁCH QUY ĐỊNH:');
    regulations.forEach((reg, i) => {
      console.log(`${i + 1}. [${reg.code}] ${reg.title} - ${reg.value?.toLocaleString('vi-VN')} ${reg.unit || ''}`);
    });

    console.log('\n✅ Hoàn tất seed dữ liệu!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

seedData();
