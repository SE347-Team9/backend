const express = require('express');
const router = express.Router();
const regulationController = require('../controllers/regulation.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

router.use(protect);

// Tất cả role đều xem được quy định
router.get('/', regulationController.getAllRegulations);
router.get('/:id', regulationController.getRegulationById);

// Chỉ admin mới được cập nhật quy định
router.put('/:id', isAdmin, regulationController.updateRegulation);

module.exports = router;
