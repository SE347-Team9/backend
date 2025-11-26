const express = require('express');
const router = express.Router();
const importController = require('../controllers/import.controller');
const { protect } = require('../middleware/auth.middleware');
const { isStaffOrAdmin } = require('../middleware/role.middleware');

// Chỉ staff hoặc admin
router.use(protect, isStaffOrAdmin);

router.get('/', importController.getAllImports);
router.get('/:id', importController.getImportById);
router.post('/', importController.createImport);
router.put('/:id', importController.updateImport);
router.delete('/:id', importController.deleteImport);

module.exports = router;
