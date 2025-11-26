const mongoose = require('mongoose');

const importSchema = new mongoose.Schema({
  importCode: {
    type: String,
    required: [true, 'Vui lòng nhập mã phiếu nhập'],
    unique: true,
    trim: true,
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
  importDate: {
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

module.exports = mongoose.model('Import', importSchema);
