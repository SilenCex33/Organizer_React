import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import SplashScreen from './components/SplashScreen'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import EditorDashboard from './pages/EditorDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
// Geschützte Route Komponente
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('userRole');
  
  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

// Hauptkomponente
function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div className="app-container">
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/editor-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Editor']}>
                  <EditorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Editor', 'User']}>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App
