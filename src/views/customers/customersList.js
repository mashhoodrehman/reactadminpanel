import React, { useEffect, useState } from 'react';
import { getCustomersAPI } from '../../services/customerService'; // new service file for customers
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      const res = await getCustomersAPI();
      setCustomers(res.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load customers');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="customer-list">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Customers List</h4>
        {/* Optional create button */}
        {/* <button className="btn btn-primary" onClick={() => navigate('/admin/customer-create')}>
          + Create Customer
        </button> */}
      </div>

      <table className="table table-striped table-bordered">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Subscribed</th>
          <th>Subscription Ends</th>
        </tr>
        </thead>
        <tbody>
        {customers.length > 0 ? (
          customers.map((customer, index) => (
            <tr key={customer.id}>
              <td>{index + 1}</td>
              <td>{customer.name}</td>
              <td>{customer.phone}</td>
              <td>
                {customer.isSubscribed ? (
                  <span className="badge bg-success">Active</span>
                ) : (
                  <span className="badge bg-danger">Inactive</span>
                )}
              </td>
              <td>
                {customer.subscriptionEndsAt
                  ? new Date(customer.subscriptionEndsAt).toLocaleDateString()
                  : 'N/A'}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center">
              No customers found
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
