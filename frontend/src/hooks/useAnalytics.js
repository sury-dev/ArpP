import { useState, useEffect, useCallback, useMemo } from 'react';
import { analyticsAPI } from '../services/api';

export const useAnalytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [incomeVsExpense, setIncomeVsExpense] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    period: 'month',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyticsAPI.getDashboard(filters);
      setDashboardData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchMonthlyTrends = useCallback(async () => {
    try {
      const response = await analyticsAPI.getMonthlyTrends(filters);
      setMonthlyTrends(response.data);
    } catch (err) {
      console.error('Failed to fetch monthly trends:', err);
    }
  }, [filters]);

  const fetchCategoryBreakdown = useCallback(async () => {
    try {
      const response = await analyticsAPI.getCategoryBreakdown(filters);
      setCategoryBreakdown(response.data);
    } catch (err) {
      console.error('Failed to fetch category breakdown:', err);
    }
  }, [filters]);

  const fetchIncomeVsExpense = useCallback(async () => {
    try {
      const response = await analyticsAPI.getIncomeVsExpense(filters);
      setIncomeVsExpense(response.data);
    } catch (err) {
      console.error('Failed to fetch income vs expense data:', err);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Memoized calculations
  const totalIncome = useMemo(() => {
    if (!dashboardData) return 0;
    return dashboardData.totalIncome || 0;
  }, [dashboardData]);

  const totalExpenses = useMemo(() => {
    if (!dashboardData) return 0;
    return dashboardData.totalExpenses || 0;
  }, [dashboardData]);

  const netIncome = useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  const savingsRate = useMemo(() => {
    if (totalIncome === 0) return 0;
    return ((netIncome / totalIncome) * 100).toFixed(2);
  }, [netIncome, totalIncome]);

  const topCategories = useMemo(() => {
    return categoryBreakdown
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [categoryBreakdown]);

  const monthlyData = useMemo(() => {
    return monthlyTrends.map(item => ({
      month: item.month,
      income: item.income || 0,
      expenses: item.expenses || 0,
      net: (item.income || 0) - (item.expenses || 0)
    }));
  }, [monthlyTrends]);

  useEffect(() => {
    fetchDashboardData();
    fetchMonthlyTrends();
    fetchCategoryBreakdown();
    fetchIncomeVsExpense();
  }, [fetchDashboardData, fetchMonthlyTrends, fetchCategoryBreakdown, fetchIncomeVsExpense]);

  return {
    dashboardData,
    monthlyTrends: monthlyData,
    categoryBreakdown,
    incomeVsExpense,
    loading,
    error,
    filters,
    totalIncome,
    totalExpenses,
    netIncome,
    savingsRate,
    topCategories,
    updateFilters,
    refetch: fetchDashboardData
  };
}; 