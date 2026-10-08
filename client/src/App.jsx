import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/common/LoadingSpinner'
import HomePage from './pages/public/HomePage'
import PropertiesPage from './pages/public/PropertiesPage'
import PropertyDetailPage from './pages/public/PropertyDetailPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import FavoritesPage from './pages/buyer/FavoritesPage'
import InquiriesPage from './pages/buyer/InquiriesPage'
import AddPropertyPage from './pages/owner/AddPropertyPage'
import ManageListingsPage from './pages/owner/ManageListingsPage'
import EditPropertyPage from './pages/owner/EditPropertyPage'
import OwnerInquiriesPage from './pages/owner/OwnerInquiriesPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminListings from './pages/admin/AdminListings'
import ProfilePage from './pages/ProfilePage'

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner />
  if (user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="properties/:id" element={<PropertyDetailPage />} />
        <Route path="login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="favorites" element={<ProtectedRoute roles={['buyer','admin']}><FavoritesPage /></ProtectedRoute>} />
        <Route path="inquiries" element={<ProtectedRoute roles={['buyer','admin']}><InquiriesPage /></ProtectedRoute>} />
        <Route path="owner/add-property" element={<ProtectedRoute roles={['owner','admin']}><AddPropertyPage /></ProtectedRoute>} />
        <Route path="owner/listings" element={<ProtectedRoute roles={['owner','admin']}><ManageListingsPage /></ProtectedRoute>} />
        <Route path="owner/edit/:id" element={<ProtectedRoute roles={['owner','admin']}><EditPropertyPage /></ProtectedRoute>} />
        <Route path="owner/inquiries" element={<ProtectedRoute roles={['owner','admin']}><OwnerInquiriesPage /></ProtectedRoute>} />
        <Route path="admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="admin/listings" element={<ProtectedRoute roles={['admin']}><AdminListings /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
