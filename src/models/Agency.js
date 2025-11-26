const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Vui lòng nhập mã đại lý'],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên đại lý'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Vui lòng nhập địa chỉ'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Vui lòng nhập số điện thoại'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  debt: {
    type: Number,
    default: 0,
  },
  district: {
    type: String,
    trim: true,
  },
  type: {
    type: Number,
    enum: [1, 2], // 1: Loại 1, 2: Loại 2
    default: 1,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Agency', agencySchema);
