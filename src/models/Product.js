const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Vui lòng nhập mã sản phẩm'],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên sản phẩm'],
    trim: true,
  },
  unit: {
    type: String,
    required: [true, 'Vui lòng nhập đơn vị tính'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Vui lòng nhập giá'],
    min: [0, 'Giá phải lớn hơn 0'],
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Tồn kho không được âm'],
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
