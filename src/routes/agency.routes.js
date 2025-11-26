const express = require('express');
const router = express.Router();
const agencyController = require('../controllers/agency.controller');
const { protect } = require('../middleware/auth.middleware');
const { isStaffOrAdmin } = require('../middleware/role.middleware');

// Tất cả routes yêu cầu đăng nhập
router.use(protect);

router.get('/', agencyController.getAllAgencies);
router.get('/:id', agencyController.getAgencyById);

// Chỉ staff hoặc admin mới được tạo/sửa/xóa
router.post('/', isStaffOrAdmin, agencyController.createAgency);
router.put('/:id', isStaffOrAdmin, agencyController.updateAgency);
router.delete('/:id', isStaffOrAdmin, agencyController.deleteAgency);

module.exports = router;
