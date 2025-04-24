import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaArrowRight, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUsersListAPI, deleteUserAPI } from "../../services/UserListing";

const UserListing = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async (page = 1) => {
    try {
      const response = await getUsersListAPI(page, pagination.limit);
      if (response?.success) {
        setUsers(response?.data || []);
      } else {
        toast.error(response.message || "Failed to load users");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePagination = (newPage) => {
    fetchUsers(newPage);
    window.scrollTo(0, 0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await deleteUserAPI(userId);
        if (response.success) {
          toast.success(response.message || "User deleted successfully");
          fetchUsers(pagination.page);
        } else {
          toast.error(response.message || "Failed to delete user");
        }
      } catch (error) {
        toast.error(error.message || "Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <button className="btn btn-primary" onClick={() => navigate("/user-create")}>Create User</button>
      </div>
      <div className="user-list-table">
        <table className="table table-striped table-responsive">
          <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Country Code</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={user.id} className="align-middle">
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.phone || "—"}</td>
                <td>{user.country_code || "—"}</td>
                <td>
                  {user.Roles?.length > 0
                    ? user.Roles.map((role) => role.name).join(", ")
                    : "N/A"}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => navigate(`/user-edit/${user.id}`, { state: { roleName: user.Roles?.[0]?.name || "" } })}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
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
            onClick={() => handlePagination(pagination.page - 1)}
          >
            <FaArrowLeft />
          </button>

          {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, index) => (
            <button
              key={index + 1}
              className={`btn ${pagination.page === index + 1 ? 'btn-dark btn-active' : 'btn-secondary'} me-2`}
              onClick={() => handlePagination(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="pagination-btn ms-2"
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            onClick={() => handlePagination(pagination.page + 1)}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserListing;
