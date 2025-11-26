const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Xác thực token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Lấy token từ header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Kiểm tra token có tồn tại
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để truy cập',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user từ database
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Người dùng không tồn tại',
        });
      }

      if (req.user.status === 'inactive') {
        return res.status(401).json({
          success: false,
          message: 'Tài khoản đã bị vô hiệu hóa',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi xác thực',
      error: error.message,
    });
  }
};
