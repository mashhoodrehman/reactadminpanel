import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUsers, deleteUser } from "../../services/userService";
import { getRoles } from "../../services/roleService";

const DataTable = React.lazy(() => import('react-data-table-component'))

const UserListing = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();

  // Fetch users and roles
  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      try {
        const { users, meta } = await getUsers();
        setUsers(users);
        setPagination(meta);

        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        toast.error(error.message || "Failed to load users and roles");
      }
    };
    fetchUsersAndRoles();
  }, []);

  // Handle edit user
  const handleEdit = (id, roleName) => {
    navigate(`/user/edit/${id}`, { state: { roleName } });
  };

  // Handle delete user
  const handleDelete = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { message } = await deleteUser(userId);
          setUsers(users.filter((user) => user.id !== userId));
          toast.success(message || "User deleted successfully");
          Swal.fire("Deleted!", message || "The user has been deleted.", "success");
        } catch (error) {
          toast.error(error.message || "Failed to delete user");
        }
      }
    });
  };

  // Map roleId to role name
  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Unknown Role";
  };

  // DataTable columns definition
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => getRoleName(row.roleId),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button
            className="edit-button me-2"
            onClick={() => handleEdit(row.id, getRoleName(row.roleId))}
          >
            <FaEdit /> Edit
          </button>
          <button
            className="delete-button"
            onClick={() => handleDelete(row.id)}
          >
            <FaTrash /> Delete
          </button>
        </div>
      ),
    },
  ];


  const tableOptions = {
    pagination: true,
    paginationPerPage: 10,
    paginationTotalRows: pagination.total || 0,
    onChangePage: (page) => handlePagination(page),
    subHeader: true,
    subHeaderComponent: (
      <input
        type="text"
        placeholder="Search"
        className="form-control"
        onChange={(e) => handleSearch(e.target.value)}
      />
    ),
  };


  const handlePagination = async (page) => {
    try {
      const { users: newUsers, meta } = await getUsers(page);
      setUsers(newUsers);
      setPagination(meta);
    } catch (error) {
      toast.error(error.message || "Failed to fetch users");
    }
  };


  const handleSearch = (searchTerm) => {
    const filteredUsers = users.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRoleName(user.roleId).toLowerCase().includes(searchTerm.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  return (
    <div>
      <div className="d-flex justify-content-end align-items-center mb-3">
        <button className="black-btn" onClick={() => navigate("/user-create")}>
          Add User
        </button>
      </div>

      <DataTable
        title="User Listing"
        columns={columns}
        data={users}
        pagination
        paginationPerPage={10}
        paginationTotalRows={pagination.total || 0}
        onChangePage={handlePagination}
        subHeader
        subHeaderComponent={
          <input
            type="text"
            placeholder="Search"
            className="form-control"
            onChange={(e) => handleSearch(e.target.value)}
          />
        }
      />
    </div>
  );
};

export default UserListing;
