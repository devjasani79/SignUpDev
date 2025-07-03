// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import VerifyOtp from "./pages/VerifyOtp";
import PublicSignerPage from "./pages/PublicSignerPage"; 

// Private (Protected) pages
import Dashboard from "./pages/Dashboard";
// import UploadAndViewPDF from "./components/UploadAndViewPDF"; // Optional future route

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/verify" element={<VerifyOtp />} />
<Route path="/sign/:token" element={<PublicSignerPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Optional Viewer (Future use) */}
          {/* <Route
            path="/view/:id"
            element={
              <ProtectedRoute>
                <UploadAndViewPDF />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
