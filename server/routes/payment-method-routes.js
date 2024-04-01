const express = require('express');
const router = express.Router();
const PaymentMethodController = require('../controllers/payment-method-controller');
const { authenticate } = require('../bin/jwt.config');

router.post('/', authenticate, PaymentMethodController.createPaymentMethod);
router.get('/:id', authenticate, PaymentMethodController.getPaymentMethodById);
router.put('/:id', authenticate, PaymentMethodController.updatePaymentMethod);
router.delete('/:id', authenticate, PaymentMethodController.deletePaymentMethod);

module.exports = router;
