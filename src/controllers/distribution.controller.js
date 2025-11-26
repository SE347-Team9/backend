const Distribution = require('../models/Distribution');

// Lấy danh sách yêu cầu phân phối
exports.getAllDistributions = async (req, res) => {
  try {
    const { status, agencyId, page = 1, limit = 10 } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (agencyId) query.agencyId = agencyId;
    
    // Nếu user là agency, chỉ xem yêu cầu của mình
    if (req.user.role === 'agency') {
      query.agencyId = req.user.agencyId;
    }

    const skip = (page - 1) * limit;
    const total = await Distribution.countDocuments(query);
    const distributions = await Distribution.find(query)
      .populate('agencyId', 'name code')
      .populate('products.productId', 'name code')
      .populate('createdBy', 'username')
      .populate('approvedBy', 'username')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: distributions.length,
      total,
      data: distributions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy thông tin một yêu cầu
exports.getDistributionById = async (req, res) => {
  try {
    const distribution = await Distribution.findById(req.params.id)
      .populate('agencyId', 'name code address phone')
      .populate('products.productId', 'name code unit price')
      .populate('createdBy', 'username')
      .populate('approvedBy', 'username');
    
    if (!distribution) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu' });
    }

    res.status(200).json({ success: true, data: distribution });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo yêu cầu phân phối mới
exports.createDistribution = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    
    // Nếu user là agency, tự động set agencyId
    if (req.user.role === 'agency') {
      req.body.agencyId = req.user.agencyId;
    }
    
    const distribution = await Distribution.create(req.body);
    res.status(201).json({ success: true, message: 'Tạo yêu cầu phân phối thành công', data: distribution });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật yêu cầu (duyệt/từ chối)
exports.updateDistribution = async (req, res) => {
  try {
    const distribution = await Distribution.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!distribution) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu' });
    }

    // Nếu approved, ghi nhận người duyệt
    if (req.body.status === 'approved' && !distribution.approvedBy) {
      distribution.approvedBy = req.user.id;
      distribution.approvedAt = new Date();
      await distribution.save();
    }

    res.status(200).json({ success: true, message: 'Cập nhật yêu cầu thành công', data: distribution });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa yêu cầu
exports.deleteDistribution = async (req, res) => {
  try {
    const distribution = await Distribution.findByIdAndDelete(req.params.id);
    if (!distribution) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu' });
    }
    res.status(200).json({ success: true, message: 'Xóa yêu cầu thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
