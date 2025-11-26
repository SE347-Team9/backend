const Regulation = require('../models/Regulation');

// Lấy danh sách quy định
exports.getAllRegulations = async (req, res) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;
    let query = {};
    
    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const total = await Regulation.countDocuments(query);
    const regulations = await Regulation.find(query)
      .populate('updatedBy', 'username')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: regulations.length,
      total,
      data: regulations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy thông tin một quy định
exports.getRegulationById = async (req, res) => {
  try {
    const regulation = await Regulation.findById(req.params.id)
      .populate('updatedBy', 'username');
    
    if (!regulation) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy quy định' });
    }

    res.status(200).json({ success: true, data: regulation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật quy định (chỉ admin)
exports.updateRegulation = async (req, res) => {
  try {
    req.body.updatedBy = req.user.id;
    
    const regulation = await Regulation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!regulation) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy quy định' });
    }

    res.status(200).json({ success: true, message: 'Cập nhật quy định thành công', data: regulation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
