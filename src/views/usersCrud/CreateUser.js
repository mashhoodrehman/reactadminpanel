import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../services/userService";
import { getRoles } from "../../services/roleService";
import { CCol, CRow } from "@coreui/react";

const CreateUser = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        setRoles(response?.data || []);
      } catch (error) {
        toast.error(error.message || "Failed to fetch roles");
      }
    };

    fetchRoles();
  }, []);

  const UserSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone: Yup.string().required("Phone is required"),
    country_code: Yup.string().required("Country code is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    roleId: Yup.string().required("Role is required"),
  });

  return (
    <div className="brand-create-card">
      <Formik
        initialValues={{
          name: "",
          phone: "",
          country_code: "",
          password: "",
          confirmPassword: "",
          roleId: "",
          reg_type: 1,
        }}
        validationSchema={UserSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const payload = {
              name: values.name,
              phone: values.phone,
              country_code: values.country_code,
              password: values.password,
              roleId: values.roleId,
              reg_type: 1,
            };

            const { message } = await createUser(payload);
            toast.success(message || "User created successfully!");
            navigate("/user-listing");
          } catch (error) {
            toast.error(error.message || "Failed to create user");
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
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="error-message"
                  />
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
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error-message"
                  />
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
                  <ErrorMessage
                    name="roleId"
                    component="div"
                    className="error-message"
                  />
                </div>
              </CCol>

              <CCol lg={6}>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-message"
                  />
                </div>
              </CCol>

              <CCol lg={6}>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="error-message"
                  />
                </div>
              </CCol>
            </CRow>

            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateUser;
