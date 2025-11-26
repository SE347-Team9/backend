// Kiểm tra quyền truy cập theo role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} không có quyền truy cập`,
      });
    }

    next();
  };
};

// Kiểm tra quyền admin
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ admin mới có quyền truy cập',
    });
  }
  next();
};

// Kiểm tra quyền staff hoặc admin
exports.isStaffOrAdmin = (req, res, next) => {
  if (!req.user || !['staff', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Chỉ staff hoặc admin mới có quyền truy cập',
    });
  }
  next();
};

// Kiểm tra agency chỉ xem được dữ liệu của mình
exports.checkAgencyAccess = (req, res, next) => {
  if (req.user.role === 'agency') {
    // Agency chỉ được xem dữ liệu của chính mình
    if (req.params.agencyId && req.params.agencyId !== req.user.agencyId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập dữ liệu này',
      });
    }
  }
  next();
};
