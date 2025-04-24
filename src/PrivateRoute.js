import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import routes from './routes' // Import routes to check permissions
import { usePermissions } from './helper/usePermissions' // Import permission hooks

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const { hasPermission, isSuperAdmin } = usePermissions()
  const location = useLocation()

  // If user is not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Get the current route object based on the path
  const currentRoute = routes.find(route => route.path === location.pathname)

  // If the route requires a permission and the user lacks it, show a toast and redirect
  if (currentRoute?.permission && !hasPermission(currentRoute.permission) && !isSuperAdmin) {
    toast.error("You don't have permission to access this page")
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
