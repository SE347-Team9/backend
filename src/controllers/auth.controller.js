const User = require('../models/User');
const Agency = require('../models/Agency');
const jwt = require('jsonwebtoken');

// Tạo JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Đăng ký user mới
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, agencyId, address, phone } = req.body;

    // Kiểm tra user đã tồn tại
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Username hoặc email đã tồn tại',
      });
    }

    let newAgencyId = agencyId;

    // Nếu role là agency, tạo Agency record mới
    if (role === 'agency') {
      if (!address || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ địa chỉ và số điện thoại cho đại lý',
        });
      }

      // Tạo mã đại lý tự động
      const agencyCount = await Agency.countDocuments();
      const agencyCode = `DL${String(agencyCount + 1).padStart(3, '0')}`;

      // Tạo Agency mới
      const agency = await Agency.create({
        code: agencyCode,
        name: username, // Sử dụng username làm tên đại lý ban đầu
        address,
        phone,
        email,
        status: 'active',
        debt: 0,
        type: 1, // Mặc định loại 1
      });

      newAgencyId = agency._id;
    }

    // Tạo user mới
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'staff',
      agencyId: newAgencyId,
    });

    // Tạo token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          agencyId: user.agencyId,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đăng ký',
      error: error.message,
    });
  }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập username và password',
      });
    }

    // Tìm user (bao gồm password)
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Username hoặc password không đúng',
      });
    }

    // Kiểm tra password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Username hoặc password không đúng',
      });
    }

    // Kiểm tra trạng thái
    if (user.status === 'inactive') {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị vô hiệu hóa',
      });
    }

    // Tạo token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          agencyId: user.agencyId,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đăng nhập',
      error: error.message,
    });
  }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('agencyId', 'name code');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin user',
      error: error.message,
    });
  }
};

// @desc    Đăng xuất
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Với JWT, logout chủ yếu xử lý ở client (xóa token)
    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đăng xuất',
      error: error.message,
    });
  }
};
