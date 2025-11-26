const Payment = require('../models/Payment');
const Agency = require('../models/Agency');

// Lấy danh sách phiếu thu
exports.getAllPayments = async (req, res) => {
  try {
    const { status, agencyId, page = 1, limit = 10 } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (agencyId) query.agencyId = agencyId;
    
    // Nếu user là agency, chỉ xem phiếu thu của mình
    if (req.user.role === 'agency') {
      query.agencyId = req.user.agencyId;
    }

    const skip = (page - 1) * limit;
    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate('agencyId', 'name code')
      .populate('createdBy', 'username')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy thông tin một phiếu thu
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('agencyId', 'name code address phone debt')
      .populate('createdBy', 'username');
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu thu' });
    }

    // Kiểm tra quyền truy cập
    if (req.user.role === 'agency' && payment.agencyId._id.toString() !== req.user.agencyId.toString()) {
      return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo phiếu thu mới
exports.createPayment = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const payment = await Payment.create(req.body);

    // Giảm công nợ đại lý nếu status là paid
    if (payment.status === 'paid') {
      await Agency.findByIdAndUpdate(payment.agencyId, {
        $inc: { debt: -payment.amount },
      });
    }

    res.status(201).json({ success: true, message: 'Tạo phiếu thu thành công', data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật phiếu thu
exports.updatePayment = async (req, res) => {
  try {
    const oldPayment = await Payment.findById(req.params.id);
    if (!oldPayment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu thu' });
    }

    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Xử lý công nợ khi status thay đổi
    if (oldPayment.status !== 'paid' && payment.status === 'paid') {
      await Agency.findByIdAndUpdate(payment.agencyId, {
        $inc: { debt: -payment.amount },
      });
    }

    res.status(200).json({ success: true, message: 'Cập nhật phiếu thu thành công', data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa phiếu thu
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu thu' });
    }
    res.status(200).json({ success: true, message: 'Xóa phiếu thu thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
