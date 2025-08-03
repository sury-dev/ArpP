const {
  addTransaction,
  updateTransaction: updateTransactionModel,
  deleteTransaction: deleteTransactionModel,
} = require("../models/transactionModel");
const pool = require("../config/db");
const redis = require("../config/redis");

const createTransaction = async (req, res) => {
  const user_id = req.user.id;
  const transaction = { ...req.body, user_id };

  const result = await addTransaction(transaction);
  res
    .status(201)
    .json({ message: "Transaction added", insertId: result.insertId });
  await redis.del(`analytics:user:${req.user.id}`);
  if (req.user.role === "admin") {
    await redis.del("analytics:admin");
  }
};

const getUserTransactions = async (req, res) => {
  const { type, category, startDate, endDate } = req.query;
  const role = req.user.role;
  const userId = req.user.id;

  try {
    let query = "SELECT * FROM transactions WHERE 1=1";
    const params = [];

    // Non-admins can only see their own data
    if (role !== "admin") {
      query += " AND user_id = ?";
      params.push(userId);
    }

    if (type) {
      query += " AND type = ?";
      params.push(type);
    }

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    if (startDate) {
      query += " AND date >= ?";
      params.push(startDate);
    }

    if (endDate) {
      query += " AND date <= ?";
      params.push(endDate);
    }

    query += " ORDER BY date DESC";

    const [rows] = await pool.execute(query, params);
    res.json({ transactions: rows });
  } catch (error) {
    console.error("Filter error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const updateTransaction = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const result = await updateTransactionModel(id, user_id, updatedData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    // Invalidate cache BEFORE sending response
    await redis.del(`analytics:user:${req.user.id}`);
    if (req.user.role === 'admin') {
      await redis.del('analytics:admin');
    }

    res.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error('Update error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// ✅ deleteTransaction using model function
const deleteTransaction = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;

  try {
    const result = await deleteTransactionModel(id, user_id);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Transaction not found or unauthorized" });
    }

    // Invalidate Redis cache BEFORE sending response
    await redis.del(`analytics:user:${req.user.id}`);
    if (req.user.role === "admin") {
      await redis.del("analytics:admin");
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTransaction,
  getUserTransactions,
  updateTransaction,
  deleteTransaction,
};
