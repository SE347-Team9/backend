const express = require('express');
const router = express.Router();
const exportController = require('../controllers/export.controller');
const { protect } = require('../middleware/auth.middleware');
const { isStaffOrAdmin } = require('../middleware/role.middleware');

router.use(protect);

// Agency có thể xem exports của mình, staff/admin xem tất cả
router.get('/', exportController.getAllExports);
router.get('/:id', exportController.getExportById);

// Chỉ staff hoặc admin mới tạo/sửa/xóa
router.post('/', isStaffOrAdmin, exportController.createExport);
router.put('/:id', isStaffOrAdmin, exportController.updateExport);
router.delete('/:id', isStaffOrAdmin, exportController.deleteExport);

module.exports = router;
