const express = require('express');
const router = express.Router();
const ExpenseTypeController = require('../controllers/expense-type-controller');

router.post('/', ExpenseTypeController.createExpenseType);
router.get('/', ExpenseTypeController.getAllExpenseTypes);
router.get('/:id', ExpenseTypeController.getExpenseTypeById);
router.put('/:id', ExpenseTypeController.updateExpenseType);
router.delete('/:id', ExpenseTypeController.deleteExpenseType);

module.exports = router;
