import React, { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { useTheme } from '../context/ThemeContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, Radar } from 'react-chartjs-2';
import './Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

const Analytics = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const {
    dashboardData,
    monthlyTrends,
    categoryBreakdown,
    incomeVsExpense,
    totalIncome,
    totalExpenses,
    netIncome,
    savingsRate,
    topCategories,
    loading,
    error,
    filters,
    updateFilters
  } = useAnalytics();

  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme === 'dark' ? '#fff' : '#333',
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? '#fff' : '#333'
        },
        grid: {
          color: theme === 'dark' ? '#444' : '#e1e5e9'
        }
      },
      y: {
        ticks: {
          color: theme === 'dark' ? '#fff' : '#333',
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        },
        grid: {
          color: theme === 'dark' ? '#444' : '#e1e5e9'
        }
      }
    }
  }), [theme]);

  const handlePeriodChange = useCallback((period) => {
    setSelectedPeriod(period);
    updateFilters({ period });
  }, [updateFilters]);

  const handleYearChange = useCallback((year) => {
    setSelectedYear(year);
    updateFilters({ year });
  }, [updateFilters]);

  const handleMonthChange = useCallback((month) => {
    setSelectedMonth(month);
    updateFilters({ month });
  }, [updateFilters]);

  const lineChartData = useMemo(() => ({
    labels: monthlyTrends.map(item => item.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyTrends.map(item => item.income),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: monthlyTrends.map(item => item.expenses),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }), [monthlyTrends]);

  const pieChartData = useMemo(() => ({
    labels: categoryBreakdown.map(item => item.category),
    datasets: [
      {
        data: categoryBreakdown.map(item => item.amount),
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#06b6d4',
          '#84cc16',
          '#f97316'
        ],
        borderWidth: 2,
        borderColor: theme === 'dark' ? '#1a1a1a' : '#fff'
      }
    ]
  }), [categoryBreakdown, theme]);

  const barChartData = useMemo(() => ({
    labels: ['Income', 'Expenses', 'Net'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [totalIncome, totalExpenses, netIncome],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          '#10b981',
          '#ef4444',
          '#3b82f6'
        ],
        borderWidth: 2
      }
    ]
  }), [totalIncome, totalExpenses, netIncome]);

  const radarChartData = useMemo(() => ({
    labels: topCategories.map(cat => cat.category),
    datasets: [
      {
        label: 'Spending by Category',
        data: topCategories.map(cat => cat.amount),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3b82f6'
      }
    ]
  }), [topCategories]);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }, []);

  const months = useMemo(() => {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  }, []);

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <div className="error-message">
          <h3>Error loading analytics</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div className="header-content">
          <h1>Financial Analytics</h1>
          <p>Detailed insights into your financial patterns</p>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-controls">
          <div className="filter-group">
            <label>Period:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="filter-select"
            >
              <option value="month">Monthly</option>
              <option value="quarter">Quarterly</option>
              <option value="year">Yearly</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              className="filter-select"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {selectedPeriod === 'month' && (
            <div className="filter-group">
              <label>Month:</label>
              <select
                value={selectedMonth}
                onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                className="filter-select"
              >
                {months.map((month, index) => (
                  <option key={index + 1} value={index + 1}>{month}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="analytics-summary">
        <div className="summary-card">
          <h3>Total Income</h3>
          <p className="amount positive">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p className="amount negative">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Net Income</h3>
          <p className={`amount ${netIncome >= 0 ? 'positive' : 'negative'}`}>
            ${netIncome.toLocaleString()}
          </p>
        </div>
        <div className="summary-card">
          <h3>Savings Rate</h3>
          <p className="amount">{savingsRate}%</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card large">
          <h3>Monthly Trends</h3>
          <div className="chart-container">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Income vs Expenses</h3>
          <div className="chart-container">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Category Distribution</h3>
          <div className="chart-container">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Spending Radar</h3>
          <div className="chart-container">
            <Radar data={radarChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Top Spending Categories</h3>
          <div className="categories-breakdown">
            {topCategories.map((category, index) => (
              <div key={category.category} className="category-item">
                <div className="category-info">
                  <span className="category-name">{category.category}</span>
                  <span className="category-amount">${category.amount.toLocaleString()}</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-progress"
                    style={{
                      width: `${(category.amount / topCategories[0]?.amount) * 100}%`,
                      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index]
                    }}
                  ></div>
                </div>
                <div className="category-percentage">
                  {((category.amount / totalExpenses) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Financial Health Score</h3>
          <div className="health-score">
            <div className="score-circle">
            <div className="some-value">{Math.min(100, Math.max(0, parseInt(savingsRate)))}</div>
            <div className="score-label">Health Score</div>
            </div>
            <div className="score-breakdown">
              <div className="score-item">
                <span className="score-label">Savings Rate</span>
                <span className="score-value">{savingsRate}%</span>
              </div>
              <div className="score-item">
                <span className="score-label">Income Growth</span>
                <span className="score-value">
                  {monthlyTrends.length > 1 ? 
                    ((monthlyTrends[monthlyTrends.length - 1].income - monthlyTrends[0].income) / monthlyTrends[0].income * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="score-item">
                <span className="score-label">Expense Control</span>
                <span className="score-value">
                  {monthlyTrends.length > 1 ? 
                    ((monthlyTrends[0].expenses - monthlyTrends[monthlyTrends.length - 1].expenses) / monthlyTrends[0].expenses * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
