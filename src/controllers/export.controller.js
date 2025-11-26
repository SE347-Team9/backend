const Export = require('../models/Export');
const Product = require('../models/Product');
const Agency = require('../models/Agency');

// Lấy danh sách phiếu xuất
exports.getAllExports = async (req, res) => {
  try {
    const { status, agencyId, page = 1, limit = 10 } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (agencyId) query.agencyId = agencyId;
    
    // Nếu user là agency, chỉ xem phiếu xuất của mình
    if (req.user.role === 'agency') {
      query.agencyId = req.user.agencyId;
    }

    const skip = (page - 1) * limit;
    const total = await Export.countDocuments(query);
    const exports = await Export.find(query)
      .populate('agencyId', 'name code')
      .populate('products.productId', 'name code')
      .populate('createdBy', 'username')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: exports.length,
      total,
      data: exports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy thông tin một phiếu xuất
exports.getExportById = async (req, res) => {
  try {
    const exportDoc = await Export.findById(req.params.id)
      .populate('agencyId', 'name code address phone')
      .populate('products.productId', 'name code unit')
      .populate('createdBy', 'username');
    
    if (!exportDoc) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu xuất' });
    }

    // Kiểm tra quyền truy cập
    if (req.user.role === 'agency' && exportDoc.agencyId._id.toString() !== req.user.agencyId.toString()) {
      return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
    }

    res.status(200).json({ success: true, data: exportDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo phiếu xuất mới
exports.createExport = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const exportDoc = await Export.create(req.body);

    // Cập nhật tồn kho và công nợ nếu status là completed
    if (exportDoc.status === 'completed') {
      // Giảm tồn kho
      for (const item of exportDoc.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }
      
      // Tăng công nợ đại lý
      await Agency.findByIdAndUpdate(exportDoc.agencyId, {
        $inc: { debt: exportDoc.totalAmount },
      });
    }

    res.status(201).json({ success: true, message: 'Tạo phiếu xuất thành công', data: exportDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật phiếu xuất
exports.updateExport = async (req, res) => {
  try {
    const oldExport = await Export.findById(req.params.id);
    if (!oldExport) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu xuất' });
    }

    const exportDoc = await Export.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Xử lý tồn kho và công nợ khi status thay đổi
    if (oldExport.status !== 'completed' && exportDoc.status === 'completed') {
      for (const item of exportDoc.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }
      await Agency.findByIdAndUpdate(exportDoc.agencyId, {
        $inc: { debt: exportDoc.totalAmount },
      });
    }

    res.status(200).json({ success: true, message: 'Cập nhật phiếu xuất thành công', data: exportDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa phiếu xuất
exports.deleteExport = async (req, res) => {
  try {
    const exportDoc = await Export.findByIdAndDelete(req.params.id);
    if (!exportDoc) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu xuất' });
    }
    res.status(200).json({ success: true, message: 'Xóa phiếu xuất thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
