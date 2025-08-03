const pool = require('../config/db');

// Helper function to build base condition and params
const buildBaseCondition = (req) => {
  const role = req.user.role;
  const userId = req.user.id;
  const params = [];
  let baseCondition = 'WHERE 1=1';

  if (role !== 'admin') {
    baseCondition += ' AND user_id = ?';
    params.push(userId);
  }

  return { baseCondition, params };
};

// Dashboard analytics
const getDashboard = async (req, res) => {
  try {
    const { period = 'month', year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;
    const { baseCondition, params } = buildBaseCondition(req);

    // Add date filtering
    let dateCondition = '';
    if (period === 'month') {
      dateCondition = ` AND YEAR(date) = ? AND MONTH(date) = ?`;
      params.push(parseInt(year), parseInt(month));
    } else if (period === 'year') {
      dateCondition = ` AND YEAR(date) = ?`;
      params.push(parseInt(year));
    }

    const [incomeRows] = await pool.execute(
      `SELECT SUM(amount) as totalIncome FROM transactions ${baseCondition} AND type = 'income'${dateCondition}`,
      params
    );
    const [expenseRows] = await pool.execute(
      `SELECT SUM(amount) as totalExpenses FROM transactions ${baseCondition} AND type = 'expense'${dateCondition}`,
      params
    );

    const totalIncome = incomeRows[0].totalIncome || 0;
    const totalExpenses = expenseRows[0].totalExpenses || 0;
    const netIncome = totalIncome - totalExpenses;

    res.json({
      totalIncome,
      totalExpenses,
      netIncome,
      period,
      year,
      month
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Monthly trends
const getMonthlyTrends = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const { baseCondition, params } = buildBaseCondition(req);

    params.push(parseInt(year));

    const [rows] = await pool.execute(
      `SELECT 
        MONTH(date) as month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses
       FROM transactions ${baseCondition} AND YEAR(date) = ?
       GROUP BY MONTH(date)
       ORDER BY month`,
      params
    );

    // Fill in missing months with zeros
    const monthlyData = [];
    for (let i = 1; i <= 12; i++) {
      const monthData = rows.find(row => row.month === i);
      monthlyData.push({
        month: i,
        income: monthData ? monthData.income : 0,
        expenses: monthData ? monthData.expenses : 0
      });
    }

    res.json(monthlyData);
  } catch (error) {
    console.error('Monthly trends error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Category breakdown
const getCategoryBreakdown = async (req, res) => {
  try {
    const { period = 'month', year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;
    const { baseCondition, params } = buildBaseCondition(req);

    // Add date filtering
    let dateCondition = '';
    if (period === 'month') {
      dateCondition = ` AND YEAR(date) = ? AND MONTH(date) = ?`;
      params.push(parseInt(year), parseInt(month));
    } else if (period === 'year') {
      dateCondition = ` AND YEAR(date) = ?`;
      params.push(parseInt(year));
    }

    const [rows] = await pool.execute(
      `SELECT 
        category,
        type,
        SUM(amount) as amount
       FROM transactions ${baseCondition}${dateCondition}
       GROUP BY category, type
       ORDER BY amount DESC`,
      params
    );

    res.json(rows);
  } catch (error) {
    console.error('Category breakdown error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Income vs Expense comparison
const getIncomeVsExpense = async (req, res) => {
  try {
    const { period = 'month', year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;
    const { baseCondition, params } = buildBaseCondition(req);

    // Add date filtering
    let dateCondition = '';
    if (period === 'month') {
      dateCondition = ` AND YEAR(date) = ? AND MONTH(date) = ?`;
      params.push(parseInt(year), parseInt(month));
    } else if (period === 'year') {
      dateCondition = ` AND YEAR(date) = ?`;
      params.push(parseInt(year));
    }

    const [rows] = await pool.execute(
      `SELECT 
        DATE(date) as date,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses
       FROM transactions ${baseCondition}${dateCondition}
       GROUP BY DATE(date)
       ORDER BY date`,
      params
    );

    res.json(rows);
  } catch (error) {
    console.error('Income vs Expense error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  getDashboard,
  getMonthlyTrends,
  getCategoryBreakdown,
  getIncomeVsExpense
};
