import React, { useMemo } from 'react';
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
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import './Dashboard.css';

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
  Filler
);

const Dashboard = () => {
  const { user, canAdd } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    dashboardData,
    monthlyTrends,
    categoryBreakdown,
    totalIncome,
    totalExpenses,
    netIncome,
    savingsRate,
    topCategories,
    loading,
    error
  } = useAnalytics();

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

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h3>Error loading dashboard</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, {user?.name || user?.email}!</h1>
          <p>Here's your financial overview</p>
        </div>
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card income">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Income</h3>
            <p className="stat-amount">${totalIncome.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card expenses">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h3>Total Expenses</h3>
            <p className="stat-amount">${totalExpenses.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card net">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Net Income</h3>
            <p className={`stat-amount ${netIncome >= 0 ? 'positive' : 'negative'}`}>
              ${netIncome.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="stat-card savings">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Savings Rate</h3>
            <p className="stat-amount">{savingsRate}%</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
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
          <h3>Category Breakdown</h3>
          <div className="chart-container">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Top Categories</h3>
          <div className="categories-list">
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
              </div>
            ))}
          </div>
        </div>
      </div>

      {!canAdd && (
        <div className="read-only-notice">
          <p>📖 You are in read-only mode. Contact an administrator to make changes.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
