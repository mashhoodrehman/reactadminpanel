import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaTrash, FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { getAdminRolesApi, deleteAdminRoleAPI } from '../../services/adminRolePermissionService'

const RoleListing = () => {
  const [roles, setRoles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const fetchRoles = async () => {
    try {
      const response = await getAdminRolesApi()
      if (response?.success && Array.isArray(response.data)) {
        setRoles(response.data)
      } else {
        toast.error(response?.message || 'Failed to load roles')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load roles')
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleDelete = async (roleId) => {
    if (window.confirm('Are you sure to delete this role?')) {
      try {
        const response = await deleteAdminRoleAPI(roleId)
        toast.success(response.message || 'Role deleted')
        fetchRoles()
      } catch (error) {
        toast.error(error.message || 'Failed to delete role')
      }
    }
  }

  const handleEdit = (id) => navigate(`/role-edit-role/${id}`)

  const handleCreate = () => navigate('/role-create-role')

  const filteredRoles = roles.filter((role) =>
    (role.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleCreate}>
          Create Role
        </button>
      </div>

      <table className="table table-striped">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Permissions</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {filteredRoles.length > 0 ? (
          filteredRoles.map((role, idx) => (
            <tr key={role.id}>
              <td>{idx + 1}</td>
              <td className="text-capitalize">{role.name}</td>
              <td>
                {role.permissions?.length > 0 ? (
                  role.permissions.map((p, i) => (
                    <span className="badge bg-info text-dark me-1" key={i}>
                        {p.name}
                      </span>
                  ))
                ) : (
                  <span className="text-muted">No permissions</span>
                )}
              </td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(role.id)}>
                  <FaEdit /> Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(role.id)}>
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">No roles found</td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  )
}

export default RoleListing
