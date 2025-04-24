import React, { useEffect, useState } from 'react';
import { getPackagesAPI, deletePackageAPI } from '../../services/packageService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  const fetchPackages = async () => {
    try {
      const res = await getPackagesAPI();
      setPackages(res.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load packages');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;

    try {
      await deletePackageAPI(id);
      toast.success('Package deleted successfully');
      fetchPackages();
    } catch (err) {
      toast.error(err.message || 'Failed to delete package');
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div className="package-list">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Packages</h4>
        <button className="btn btn-primary" onClick={() => navigate('/admin/package-create')}>
          + Create Package
        </button>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Price</th>
          <th>Duration</th>
          <th>Features</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {packages.length > 0 ? (
          packages.map((pkg, index) => (
            <tr key={pkg.id}>
              <td>{index + 1}</td>
              <td>{pkg.name}</td>
              <td>${pkg.price}</td>
              <td>{pkg.duration_value} {pkg.duration_type}(s)</td>
              <td>{pkg.features?.length || 0}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => navigate(`/admin/package-edit/${pkg.id}`)}>
                  <FaEdit /> Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(pkg.id)}>
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center">No packages found</td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default PackageList;
