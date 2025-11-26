const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

// Tất cả role đều xem được báo cáo
router.get('/', reportController.getAllReports);
router.get('/:id', reportController.getReportById);

// Chỉ staff/admin tạo báo cáo
router.post('/', authorize('staff', 'admin'), reportController.createReport);

// Chỉ admin xóa
router.delete('/:id', authorize('admin'), reportController.deleteReport);

module.exports = router;
