import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import AddTransaction from "../pages/AddTransaction";
import Analytics from "../pages/Analytics";
import Navbar from "../components/Navbar";

// Layout component that includes Navbar for authenticated routes
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />

        {/* Redirect root to dashboard */}
        <Route 
          path="/" 
          element={<Navigate to="/dashboard" replace />} 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/transactions" 
          element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <Transactions />
              </AuthenticatedLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/transactions/add" 
          element={
            <PrivateRoute requiredRole="user">
              <AuthenticatedLayout>
                <AddTransaction />
              </AuthenticatedLayout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/analytics" 
          element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <Analytics />
              </AuthenticatedLayout>
            </PrivateRoute>
          } 
        />

        {/* Catch all route */}
        <Route 
          path="*" 
          element={<Navigate to="/dashboard" replace />} 
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
