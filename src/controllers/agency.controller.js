const Agency = require('../models/Agency');

// @desc    Lấy danh sách tất cả đại lý
// @route   GET /api/agencies
// @access  Private
exports.getAllAgencies = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    const total = await Agency.countDocuments(query);

    const agencies = await Agency.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: agencies.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: agencies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách đại lý',
      error: error.message,
    });
  }
};

// @desc    Lấy thông tin một đại lý
// @route   GET /api/agencies/:id
// @access  Private
exports.getAgencyById = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đại lý',
      });
    }

    res.status(200).json({
      success: true,
      data: agency,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin đại lý',
      error: error.message,
    });
  }
};

// @desc    Tạo đại lý mới
// @route   POST /api/agencies
// @access  Private (Admin/Staff)
exports.createAgency = async (req, res) => {
  try {
    const agency = await Agency.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Tạo đại lý thành công',
      data: agency,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đại lý',
      error: error.message,
    });
  }
};

// @desc    Cập nhật đại lý
// @route   PUT /api/agencies/:id
// @access  Private (Admin/Staff)
exports.updateAgency = async (req, res) => {
  try {
    const agency = await Agency.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đại lý',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật đại lý thành công',
      data: agency,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật đại lý',
      error: error.message,
    });
  }
};

// @desc    Xóa đại lý
// @route   DELETE /api/agencies/:id
// @access  Private (Admin)
exports.deleteAgency = async (req, res) => {
  try {
    const agency = await Agency.findByIdAndDelete(req.params.id);

    if (!agency) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đại lý',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa đại lý thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa đại lý',
      error: error.message,
    });
  }
};
