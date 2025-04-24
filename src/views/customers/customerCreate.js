import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPackageAPI } from '../../services/packageService';
import { toast } from 'react-toastify';
import { CCol, CRow } from '@coreui/react';

const PackageCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    duration_type: '',
    duration_value: '',
    features: ['']
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...form.features];
    updated[index] = value;
    setForm({ ...form, features: updated });
  };

  const addFeature = () => {
    setForm({ ...form, features: [...form.features, ''] });
  };

  const removeFeature = (index) => {
    const updated = form.features.filter((_, i) => i !== index);
    setForm({ ...form, features: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      duration_type: form.duration_type,
      duration_value: parseInt(form.duration_value),
      features: form.features.filter(f => f.trim() !== '')
    };

    try {
      await createPackageAPI(payload);
      toast.success('Package created successfully!');
      navigate('/admin/package-list');
    } catch (err) {
      toast.error(err.message || 'Failed to create package');
    }
  };

  return (
    <div className="brand-create-card">
      <form onSubmit={handleSubmit}>
        <CRow>
          <CCol lg={6}>
            <div className="form-group">
              <label>Package Name</label>
              <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
            </div>
          </CCol>

          <CCol lg={6}>
            <div className="form-group">
              <label>Price (USD)</label>
              <input type="number" name="price" className="form-control" value={form.price} onChange={handleChange} required />
            </div>
          </CCol>

          <CCol lg={6}>
            <div className="form-group">
              <label>Duration Type</label>
              <select name="duration_type" className="form-control" value={form.duration_type} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
          </CCol>

          <CCol lg={6}>
            <div className="form-group">
              <label>Duration Value</label>
              <input
                type="number"
                name="duration_value"
                className="form-control"
                value={form.duration_value}
                onChange={handleChange}
                placeholder="e.g. 1, 7, 30"
                required
              />
            </div>
          </CCol>

          <CCol lg={12}>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" className="form-control" rows="3" value={form.description} onChange={handleChange}></textarea>
            </div>
          </CCol>

          <CCol lg={12}>
            <label>Package Features</label>
            {form.features.map((f, i) => (
              <div key={i} className="d-flex mb-2">
                <input
                  type="text"
                  value={f}
                  onChange={(e) => handleFeatureChange(i, e.target.value)}
                  className="form-control me-2"
                />
                <button type="button" className="btn btn-danger" onClick={() => removeFeature(i)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-secondary mt-2" onClick={addFeature}>
              + Add Feature
            </button>
          </CCol>
        </CRow>

        <button type="submit" className="btn btn-primary mt-3">
          Create Package
        </button>
      </form>
    </div>
  );
};

export default PackageCreate;
