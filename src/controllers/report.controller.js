const Report = require('../models/Report');

// Lấy danh sách báo cáo
exports.getAllReports = async (req, res) => {
  try {
    const { type, year, month, page = 1, limit = 10 } = req.query;
    let query = {};
    
    if (type) query.type = type;
    if (year) query.year = parseInt(year);
    if (month) query.month = parseInt(month);

    const skip = (page - 1) * limit;
    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .populate('createdBy', 'username')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy thông tin một báo cáo
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('createdBy', 'username email');
    
    if (!report) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy báo cáo' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo báo cáo mới
exports.createReport = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const report = await Report.create(req.body);
    res.status(201).json({ success: true, message: 'Tạo báo cáo thành công', data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa báo cáo
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy báo cáo' });
    }
    res.status(200).json({ success: true, message: 'Xóa báo cáo thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
