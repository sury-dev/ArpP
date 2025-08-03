const express = require('express');
const router = express.Router();

const {
  createTransaction,
  getUserTransactions,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

const protect = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');

router.use(protect);

router.get('/', getUserTransactions);
router.post('/', allowRoles('admin', 'user'), createTransaction);
router.put('/:id', allowRoles('admin', 'user'), updateTransaction);
router.delete('/:id', allowRoles('admin', 'user'), deleteTransaction);

module.exports = router;
