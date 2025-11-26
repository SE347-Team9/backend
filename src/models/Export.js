const mongoose = require('mongoose');

const exportSchema = new mongoose.Schema({
  exportCode: {
    type: String,
    required: [true, 'Vui lòng nhập mã phiếu xuất'],
    unique: true,
    trim: true,
  },
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    required: [true, 'Vui lòng chọn đại lý'],
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: String,
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Số lượng phải lớn hơn 0'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Giá phải lớn hơn 0'],
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Tổng tiền phải lớn hơn 0'],
  },
  exportDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  note: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Export', exportSchema);
