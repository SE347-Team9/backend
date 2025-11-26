const express = require('express');
const router = express.Router();
const distributionController = require('../controllers/distribution.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.get('/', distributionController.getAllDistributions);
router.get('/:id', distributionController.getDistributionById);

// Agency có thể tạo yêu cầu
router.post('/', authorize('agency', 'staff', 'admin'), distributionController.createDistribution);

// Staff/Admin có thể cập nhật (duyệt/từ chối)
router.put('/:id', authorize('staff', 'admin'), distributionController.updateDistribution);

// Chỉ admin xóa
router.delete('/:id', authorize('admin'), distributionController.deleteDistribution);

module.exports = router;
