const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expense-controller');
const { authenticate } = require('../bin/jwt.config');

router.post('/', authenticate, ExpenseController.createExpense);
router.get('/:id', authenticate, ExpenseController.getExpenseById);
router.put('/:id', authenticate, ExpenseController.updateExpense);
router.delete('/:id', authenticate, ExpenseController.deleteExpense);

module.exports = router;
