// Xử lý lỗi toàn cục
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log lỗi ra console (để debug)
  console.error('Error:', err);

  // Lỗi Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Không tìm thấy dữ liệu';
    error = { message, statusCode: 404 };
  }

  // Lỗi Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `${field} đã tồn tại trong hệ thống`;
    error = { message, statusCode: 400 };
  }

  // Lỗi Mongoose validation
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Lỗi JWT không hợp lệ
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token không hợp lệ';
    error = { message, statusCode: 401 };
  }

  // Lỗi JWT hết hạn
  if (err.name === 'TokenExpiredError') {
    const message = 'Token đã hết hạn';
    error = { message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Lỗi máy chủ',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
