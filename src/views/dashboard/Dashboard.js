import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { getDashboardBalance } from '../../services/dashboardApiService'
import { CCol, CRow } from '@coreui/react'

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [balance, setBalance] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 10 })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    let user = null

    if (userData) {
      user = JSON.parse(userData)
      console.log('User Data from Local Storage:', user)
    } else {
      console.log('No User Data Found in Local Storage')
    }

    if (user?.permissions?.length === 0) {
      console.log('User has no permissions, fetching data...')
      fetchUsers()
    } else {
      console.log('User has permissions, API call skipped.')
    }
  }, [])

  const fetchUsers = async (page = 1) => {
    try {
      const response = await getDashboardBalance(page, pagination.limit)
      if (response?.result === 'success') {
        setUsers(response?.data?.data || [])

        setPagination({
          page: Number(response?.data?.currentPage),
          total: Number(response?.data?.total),
          limit: Number(response?.data?.limit),
        })

        setBalance(response?.data?.balance?.data || '0.00')
        toast.success(response?.message)
      } else {
        toast.error(response?.message || 'Failed to load users')
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to load users')
    }
  }

  return (
    <CRow>
      <CCol lg={6}>
        <div className="card bg-primary text-white mb-4">
          <div className="card-body text-center">
            <h5>Total Users</h5>
            <h3>{pagination?.total || 0}</h3>
          </div>
        </div>
      </CCol>

      <CCol lg={6}>
        <div className="card bg-success text-white mb-4">
          <div className="card-body text-center">
            <h5>Total Events</h5>
            <h3>{users.length || 0}</h3> {/* Replace with actual event count if available */}
          </div>
        </div>
      </CCol>
    </CRow>
  )
}

export default Dashboard
