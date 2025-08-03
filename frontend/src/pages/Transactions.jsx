import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../hooks/useTransactions';
import { useTheme } from '../context/ThemeContext';
import './Transactions.css';

const Transactions = () => {
  const { canAdd, canEdit, canDelete, user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const {
    transactions,
    loading,
    error,
    pagination,
    filters,
    totals,
    updateFilters,
    updatePagination,
    deleteTransaction
  } = useTransactions();

  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [selectedCategory, setSelectedCategory] = useState(filters.category);
  const [selectedType, setSelectedType] = useState(filters.type);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'Food', 'Transport', 'Entertainment', 'Shopping', 'Healthcare',
    'Education', 'Housing', 'Utilities', 'Insurance', 'Other'
  ];

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  }, [searchTerm, updateFilters]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    updateFilters({ category });
  }, [updateFilters]);

  const handleTypeChange = useCallback((type) => {
    setSelectedType(type);
    updateFilters({ type });
  }, [updateFilters]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedType('');
    updateFilters({ search: '', category: '', type: '' });
  }, [updateFilters]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        alert('Failed to delete transaction');
      }
    }
  }, [deleteTransaction]);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const formatAmount = useCallback((amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = !searchTerm || 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || transaction.category === selectedCategory;
      const matchesType = !selectedType || transaction.type === selectedType;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [transactions, searchTerm, selectedCategory, selectedType]);

  const totalPages = useMemo(() => {
    return Math.ceil(pagination.total / pagination.limit);
  }, [pagination.total, pagination.limit]);

  if (loading) {
    return (
      <div className="transactions-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transactions-container">
        <div className="error-message">
          <h3>Error loading transactions</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <div className="header-content">
          <h1>Transactions</h1>
          <p>Manage your income and expenses</p>
        </div>
        {canAdd && (
          <button
            className="add-transaction-btn"
            onClick={() => navigate('/transactions/add')}
          >
            + Add Transaction
          </button>
        )}
      </div>

      <div className="transactions-summary">
        <div className="summary-card">
          <h3>Total Income</h3>
          <p className="amount positive">{formatAmount(totals.income)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p className="amount negative">{formatAmount(totals.expenses)}</p>
        </div>
        <div className="summary-card">
          <h3>Net Balance</h3>
          <p className={`amount ${totals.income - totals.expenses >= 0 ? 'positive' : 'negative'}`}>
            {formatAmount(totals.income - totals.expenses)}
          </p>
        </div>
      </div>

      <div className="transactions-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>

        <button
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Type:</label>
            <select
              value={selectedType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <button
            className="clear-filters-btn"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              {canEdit && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={canEdit ? 6 : 5} className="no-data">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map(transaction => (
                <tr key={transaction.id} className="transaction-row">
                  <td>{formatDate(transaction.date)}</td>
                  <td className="description">{transaction.description}</td>
                  <td>
                    <span className={`category-badge ${transaction.category.toLowerCase()}`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td>
                    <span className={`type-badge ${transaction.type}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className={`amount ${transaction.type === 'income' ? 'positive' : 'negative'}`}>
                    {formatAmount(transaction.amount)}
                  </td>
                  {canEdit && (
                    <td className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/transactions/edit/${transaction.id}`)}
                        title="Edit transaction"
                      >
                        ✏️
                      </button>
                      {canDelete && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(transaction.id)}
                          title="Delete transaction"
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={pagination.page === 1}
            onClick={() => updatePagination({ page: pagination.page - 1 })}
          >
            ← Previous
          </button>
          
          <span className="pagination-info">
            Page {pagination.page} of {totalPages}
          </span>
          
          <button
            className="pagination-btn"
            disabled={pagination.page === totalPages}
            onClick={() => updatePagination({ page: pagination.page + 1 })}
          >
            Next →
          </button>
        </div>
      )}

      {!canAdd && (
        <div className="read-only-notice">
          <p>📖 You are in read-only mode. Contact an administrator to make changes.</p>
        </div>
      )}
    </div>
  );
};

export default Transactions;
