import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../services/userService";
import { getRoles } from "../../services/roleService";
import { CCol, CRow } from "@coreui/react";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    name: "",
    phone: "",
    country_code: "",
    roleId: "",
    reg_type: "",
  });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserById(id);
        const assignedRoleId = user?.Roles?.[0]?.id || "";
        setInitialValues({
          name: user.name || "",
          phone: user.phone || "",
          country_code: user.country_code || "",
          roleId: assignedRoleId,
          reg_type: user.reg_type || "",
        });
      } catch (error) {
        toast.error(error.message || "Failed to fetch user details");
        navigate("/user-listing");
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        setRoles(response?.data || []);
      } catch (error) {
        toast.error("Failed to fetch roles");
      }
    };

    fetchUser();
    fetchRoles();
  }, [id, navigate]);

  return (
    <div className="brand-create-card">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const updatedUser = {
              name: values.name,
              phone: values.phone,
              country_code: values.country_code,
              roleId: values.roleId,
              reg_type: values.reg_type,
            };

            const { message } = await updateUser(id, updatedUser);
            toast.success(message || "User updated successfully!");
            navigate("/user-listing");
          } catch (error) {
            toast.error(error.message || "Failed to update user");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <CRow>
              <CCol lg={6}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter full name"
                    className="form-control"
                  />
                  <ErrorMessage name="name" component="div" className="error-message" />
                </div>
              </CCol>

              <CCol lg={6}>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <Field
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="Enter phone number"
                    className="form-control"
                  />
                  <ErrorMessage name="phone" component="div" className="error-message" />
                </div>
              </CCol>

              <CCol lg={6}>
                <div className="form-group">
                  <label htmlFor="country_code">Country Code</label>
                  <Field
                    type="text"
                    name="country_code"
                    id="country_code"
                    placeholder="e.g. +92"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="country_code"
                    component="div"
                    className="error-message"
                  />
                </div>
              </CCol>

              <CCol lg={6}>
                <div className="form-group">
                  <label htmlFor="roleId">Role</label>
                  <Field
                    as="select"
                    name="roleId"
                    id="roleId"
                    className="form-control"
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="roleId" component="div" className="error-message" />
                </div>
              </CCol>
            </CRow>

            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? "Updating..." : "Update User"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditUser;
