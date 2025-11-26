const Import = require('../models/Import');
const Product = require('../models/Product');

// Lấy danh sách phiếu nhập
exports.getAllImports = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const total = await Import.countDocuments(query);
    const imports = await Import.find(query)
      .populate('products.productId', 'name code')
      .populate('createdBy', 'username')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: imports.length,
      total,
      data: imports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy thông tin một phiếu nhập
exports.getImportById = async (req, res) => {
  try {
    const importDoc = await Import.findById(req.params.id)
      .populate('products.productId', 'name code unit')
      .populate('createdBy', 'username');
    
    if (!importDoc) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu nhập' });
    }
    res.status(200).json({ success: true, data: importDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo phiếu nhập mới
exports.createImport = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const importDoc = await Import.create(req.body);

    // Cập nhật tồn kho sản phẩm nếu status là completed
    if (importDoc.status === 'completed') {
      for (const item of importDoc.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    res.status(201).json({ success: true, message: 'Tạo phiếu nhập thành công', data: importDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật phiếu nhập
exports.updateImport = async (req, res) => {
  try {
    const oldImport = await Import.findById(req.params.id);
    if (!oldImport) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu nhập' });
    }

    const importDoc = await Import.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Xử lý cập nhật tồn kho nếu status thay đổi
    if (oldImport.status !== 'completed' && importDoc.status === 'completed') {
      for (const item of importDoc.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    res.status(200).json({ success: true, message: 'Cập nhật phiếu nhập thành công', data: importDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa phiếu nhập
exports.deleteImport = async (req, res) => {
  try {
    const importDoc = await Import.findByIdAndDelete(req.params.id);
    if (!importDoc) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu nhập' });
    }
    res.status(200).json({ success: true, message: 'Xóa phiếu nhập thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
