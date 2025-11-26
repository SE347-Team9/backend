const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');
const { isStaffOrAdmin } = require('../middleware/role.middleware');

router.use(protect);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Chỉ staff hoặc admin
router.post('/', isStaffOrAdmin, productController.createProduct);
router.put('/:id', isStaffOrAdmin, productController.updateProduct);
router.delete('/:id', isStaffOrAdmin, productController.deleteProduct);

module.exports = router;
