const mongoose = require('mongoose');

const regulationSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Vui lòng nhập mã quy định'],
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tiêu đề quy định'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Vui lòng nhập nội dung quy định'],
  },
  type: {
    type: String,
    enum: ['general', 'agency', 'product', 'financial', 'other'],
    default: 'general',
  },
  value: {
    type: Number, // Giá trị quy định (nếu có)
  },
  unit: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  effectiveDate: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Regulation', regulationSchema);
