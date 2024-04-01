const PaymentMethodController = require('../controllers/payment-method-controller');
const { authenticate } = require('../bin/jwt.config');

module.exports = app => {
    app.post('/api/payment-method', authenticate, PaymentMethodController.createPaymentMethod);
    app.get('/api/payment-method/:id', authenticate, PaymentMethodController.getPaymentMethodById);
    app.put('/api/payment-method/:id', authenticate, PaymentMethodController.updatePaymentMethod);
    app.delete('/api/payment-method/:id', authenticate, PaymentMethodController.deletePaymentMethod);

}
