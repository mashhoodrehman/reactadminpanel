import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaArrowRight, FaArrowLeft, FaTrash, FaEdit } from 'react-icons/fa'
import { getUsersListAPI } from '../../services/UserListing'
import avatar from '../../assets/avatarPlaceholder.jpg'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import {getUsers} from "src/services/userService";

const UserListing = () => {
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 10 })
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const ImageUrl = import.meta.env.VITE_IMAGE_BASE_URL

  const fetchUsers = async (page = 1) => {
    try {
      const response = await getUsersListAPI(page, pagination.limit)
      console.log(response?.data?.data)
      if (response?.data?.result === 'success') {
        setUsers(response?.data?.data || [])
        setPagination({
          page: Number(response?.data?.data?.page),
          total: Number(response?.data?.data?.total),
          limit: Number(response?.data?.data?.limit),
        })
        toast.success(response?.message)
      } else {
        toast.error(response?.message || 'Failed to load users')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load users')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handlePagination = (newPage) => {
    fetchUsers(newPage)
    window.scrollTo(0, 0) // Scroll to top of the page
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle edit subscription
  const handleEdit = (id) => {
    navigate(`/admin-edit/${id}`)
  }

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this subscription!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { message } = await deleteAdminUserApi(id)
          setUsers(users.filter((user) => user.id !== id))
          toast.success(message || 'Subscription deleted successfully')
          Swal.fire('Deleted!', message || 'The subscription has been deleted.', 'success')
        } catch (error) {
          toast.error(error.message || 'Failed to delete subscription')
        }
      }
    })
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="user-list-table">
        <table className="table table-striped table-responsive">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Avatar</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Role</th>
              <th>
                <div className="text-end pe-5">Actions</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id} className="align-middle">
                  <td>{index + 1}</td>
                  <td className="text-capitalize" style={{ width: '250px' }}>
                    {user?.name}
                  </td>
                  <td>
                    {user?.profile_picture != null ? (
                      <img
                        src={`${ImageUrl}/${user.profile_picture}`}
                        alt="avatar"
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '60px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <img
                        src={avatar}
                        alt="avatar"
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '60px',
                        }}
                      />
                    )}
                  </td>
                  <td>{user.email}</td>
                  <td>{new Date(user.date_of_birth).toLocaleDateString()}</td>
                  <td className="text-capitalize">{user.gender}</td>
                  <td>{user?.roles[0]?.name}</td>
                  <td>
                    <div className="d-flex justify-content-end">
                      <button className="edit-button me-2" onClick={() => handleEdit(user?.id)}>
                        <FaEdit /> Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(user?.id)}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No users available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination.total > pagination.limit && (
        <div className="pagination-controls d-flex justify-content-end align-items-center mt-4 mb-4">
          <button
            className="pagination-btn me-2"
            disabled={pagination.page <= 1}
            onClick={() => handlePagination(pagination.page - 1)} // Previous page
          >
            <FaArrowLeft />
          </button>

          {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, index) => (
            <button
              key={index + 1}
              className={`btn ${pagination.page === index + 1 ? 'btn-dark' : 'btn-secondary'} me-2`}
              onClick={() => handlePagination(index + 1)} // Specific page
            >
              {index + 1}
            </button>
          ))}

          <button
            className="pagination-btn ms-2"
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            onClick={() => handlePagination(pagination.page + 1)} // Next page
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  )
}

export default UserListing
