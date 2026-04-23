import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import App           from './App.jsx'
import CategoryPage  from './pages/CategoryPage.jsx'
import ArticlePage   from './pages/ArticlePage.jsx'
import AdminLogin    from './admin/AdminLogin.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import LoginPage from './pages/LoginPage.jsx'
import OTPVerifyPage from './pages/OTPVerifyPage.jsx'
import SubscriptionPage from './pages/SubscriptionPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"                  element={<App />} />
          <Route path="/login"             element={<LoginPage />} />
          <Route path="/verify-otp"        element={<OTPVerifyPage />} />
          <Route path="/subscription"      element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/article/:id"       element={<ArticlePage />} />
          <Route path="/admin"             element={<AdminLogin />} />
          <Route path="/admin/dashboard"   element={<AdminDashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
