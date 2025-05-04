import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { getDashboardStats } from '../../services/dashboardApiService'
import { CCol, CRow } from '@coreui/react'

const Dashboard = () => {
  const [stats, setStats] = useState({ totalCustomers: 0, totalEvents: 0 })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    let user = null

    if (userData) {
      user = JSON.parse(userData)
      console.log('User Data from Local Storage:', user)
    } else {
      console.log('No User Data Found in Local Storage')
    }

    if (true) {
      console.log('User has no permissions, fetching dashboard stats...')
      fetchDashboardStats()
    } else {
      console.log('User has permissions, API call skipped.')
    }
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStats()
      console.log(response , 'response')
      if (response) {
        setStats(response.data)
        toast.success(response.message || 'Dashboard stats loaded')
      } else {
        toast.error(response.message || 'Failed to fetch dashboard stats')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load dashboard stats')
    }
  }

  return (
    <CRow>
      <CCol lg={6}>
        <div className="card bg-primary text-white mb-4">
          <div className="card-body text-center">
            <h5>Total Customers</h5>
            <h3>{stats.totalCustomers}</h3>
          </div>
        </div>
      </CCol>

      <CCol lg={6}>
        <div className="card bg-success text-white mb-4">
          <div className="card-body text-center">
            <h5>Total Events</h5>
            <h3>{stats.totalEvents}</h3>
          </div>
        </div>
      </CCol>
    </CRow>
  )
}

export default Dashboard
