import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return currentUser ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}