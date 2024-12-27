import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import { useEffect, useState } from 'react';

// Mock authentication for development
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // For development: Set this to true to bypass authentication
    const bypassAuth = true;
    
    if (bypassAuth) {
      setIsAuthenticated(true);
      // Optionally set a mock token
      if (!localStorage.getItem('token')) {
        localStorage.setItem('token', 'mock-token-for-development');
      }
    } else {
      // Normal authentication check
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    }
  }, []);

  return { 
    isAuthenticated,
    // Add login/logout functions for easier state management
    login: () => {
      localStorage.setItem('token', 'mock-token');
      setIsAuthenticated(true);
    },
    logout: () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  };
};

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // const { isAuthenticated } = useAuth();
  
  // if (!isAuthenticated) {
  //   return <Navigate to="/auth" replace />;
  // }

  return <>{children}</>;
};

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00A651',
          borderRadius: 6,
        },
      }}
    >
      <Router>
        <Routes>
          <Route
            path="/auth"
            element={<Auth />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            {/* Add more routes as needed */}
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
