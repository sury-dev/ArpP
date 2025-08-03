const express = require('express');
const router = express.Router();

const { 
  getDashboard,
  getMonthlyTrends,
  getCategoryBreakdown,
  getIncomeVsExpense
} = require('../controllers/analyticsController');
const protect = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/monthly-trends', getMonthlyTrends);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/income-vs-expense', getIncomeVsExpense);

module.exports = router;
