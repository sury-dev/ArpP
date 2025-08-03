import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../hooks/useTransactions';
import './AddTransaction.css';

const AddTransaction = () => {
  const { canAdd } = useAuth();
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();

  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = {
    expense: [
      'Food', 'Transport', 'Entertainment', 'Shopping', 'Healthcare',
      'Education', 'Housing', 'Utilities', 'Insurance', 'Other'
    ],
    income: [
      'Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'
    ]
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!canAdd) {
      setError('You do not have permission to add transactions');
      return;
    }

    // Validation
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (!formData.category) {
      setError('Category is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      await addTransaction(transactionData);
      navigate('/transactions');
    } catch (err) {
      setError(err.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  }, [formData, canAdd, addTransaction, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/transactions');
  }, [navigate]);

  if (!canAdd) {
    return (
      <div className="add-transaction-container">
        <div className="permission-denied">
          <h2>Permission Denied</h2>
          <p>You do not have permission to add transactions.</p>
          <button onClick={handleCancel} className="back-btn">
            Back to Transactions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-transaction-container">
      <div className="add-transaction-header">
        <h1>Add New Transaction</h1>
        <p>Record your income or expense</p>
      </div>

      <div className="add-transaction-card">
        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Transaction Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="form-select"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="form-select"
              >
                <option value="">Select Category</option>
                {categories[formData.type].map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount *</label>
              <div className="amount-input">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter transaction description..."
              required
              className="form-textarea"
              rows="3"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
