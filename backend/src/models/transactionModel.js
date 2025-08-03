const pool = require('../config/db');

// 🔸 Add new transaction
const addTransaction = async (transaction) => {
  const { user_id, type, category, amount, description, date } = transaction;
  const [result] = await pool.execute(
    `INSERT INTO transactions (user_id, type, category, amount, description, date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, type, category, amount, description, date]
  );
  return result;
};

// 🔸 Get all transactions (with optional filters)
const getTransactionsByUser = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC`,
    [userId]
  );
  return rows;
};

// 🔸 Update transaction
const updateTransaction = async (id, userId, updatedData) => {
  const { type, category, amount, description, date } = updatedData;
  const [result] = await pool.execute(
    `UPDATE transactions
     SET type = ?, category = ?, amount = ?, description = ?, date = ?
     WHERE id = ? AND user_id = ?`,
    [type, category, amount, description, date, id, userId]
  );
  return result;
};

// 🔸 Delete transaction
const deleteTransaction = async (id, userId) => {
  const [result] = await pool.execute(
    `DELETE FROM transactions WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  return result;
};

module.exports = {
  addTransaction,
  getTransactionsByUser,
  updateTransaction,
  deleteTransaction,
};
