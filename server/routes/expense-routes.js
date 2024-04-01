const ExpenseController = require('../controllers/expense-controller');
const { authenticate } = require('../bin/jwt.config');

module.exports = app => {
    app.post('/api/expense', authenticate, ExpenseController.createExpense);
    app.get('/api/expense/:id', authenticate, ExpenseController.getExpenseById);
    app.put('/api/expense/:id', authenticate, ExpenseController.updateExpense);
    app.delete('/api/expense/:id', authenticate, ExpenseController.deleteExpense);

}
