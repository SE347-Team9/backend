const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');
const { isStaffOrAdmin } = require('../middleware/role.middleware');

router.use(protect);

// Agency có thể xem payments của mình, staff/admin xem tất cả
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);

// Chỉ staff hoặc admin mới tạo/sửa/xóa
router.post('/', isStaffOrAdmin, paymentController.createPayment);
router.put('/:id', isStaffOrAdmin, paymentController.updatePayment);
router.delete('/:id', isStaffOrAdmin, paymentController.deletePayment);

module.exports = router;
