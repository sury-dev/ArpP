import { useState, useEffect, useCallback, useMemo } from 'react';
import { transactionsAPI } from '../services/api';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
    dateFrom: '',
    dateTo: ''
  });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      const response = await transactionsAPI.getAll(params);
      setTransactions(response.data.transactions);
      setPagination(prev => ({
        ...prev,
        total: response.data.total
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  const addTransaction = useCallback(async (transactionData) => {
    try {
      const response = await transactionsAPI.create(transactionData);
      setTransactions(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add transaction');
    }
  }, []);

  const updateTransaction = useCallback(async (id, transactionData) => {
    try {
      const response = await transactionsAPI.update(id, transactionData);
      setTransactions(prev => 
        prev.map(t => t.id === id ? response.data : t)
      );
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update transaction');
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    try {
      await transactionsAPI.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete transaction');
    }
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const updatePagination = useCallback((newPagination) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  // Memoized filtered transactions for search
  const filteredTransactions = useMemo(() => {
    if (!filters.search) return transactions;
    
    return transactions.filter(transaction =>
      transaction.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      transaction.category.toLowerCase().includes(filters.search.toLowerCase()) ||
      transaction.amount.toString().includes(filters.search)
    );
  }, [transactions, filters.search]);

  // Memoized totals
  const totals = useMemo(() => {
    return filteredTransactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += parseFloat(transaction.amount);
      } else {
        acc.expenses += parseFloat(transaction.amount);
      }
      return acc;
    }, { income: 0, expenses: 0 });
  }, [filteredTransactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions: filteredTransactions,
    loading,
    error,
    pagination,
    filters,
    totals,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateFilters,
    updatePagination
  };
}; 