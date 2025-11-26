const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tiêu đề báo cáo'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly', 'custom'],
    default: 'monthly',
  },
  month: {
    type: Number,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // Dữ liệu linh hoạt
  },
  summary: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Report', reportSchema);
