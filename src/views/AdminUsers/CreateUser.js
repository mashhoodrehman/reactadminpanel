import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { getAllRoles, createAdminUser } from '../../services/AdminUserService'
import { CCol, CRow } from '@coreui/react'

const CreateUser = () => {
  const navigate = useNavigate()
  const [roles, setRoles] = useState([])
  const [previewImage, setPreviewImage] = useState(null)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getAllRoles()
        setRoles(rolesData?.data?.rows)
      } catch (error) {
        toast.error(error.message || 'Failed to fetch roles')
      }
    }
    fetchRoles()
  }, [])

  const UserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    gender: Yup.string().required('Gender is required'),
    date_of_birth: Yup.date().required('Date of Birth is required'),
    role_id: Yup.string().required('Role is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    profile_picture: Yup.mixed()
      .nullable()
      .test('fileType', 'Unsupported file format', (value) => {
        return !value || (value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type))
      }),
  })

  return (
    <div className="brand-create-card">
      <Formik
        initialValues={{
          name: '',
          email: '',
          gender: '',
          date_of_birth: '',
          profile_picture: null,
          role_id: '',
          password: '',
        }}
        validationSchema={UserSchema}
        onSubmit={async (values, { setSubmitting }) => {
          console.log('Form Values:', values)

          // Creating FormData object
          const formData = new FormData()
          Object.keys(values).forEach((key) => {
            if (key === 'profile_picture' && values[key]) {
              console.log('Appending file:', values[key]) // Debugging
              formData.append(key, values[key], values[key].name)
            } else {
              formData.append(key, values[key])
            }
          })

          console.log('Final FormData:', formData.get('profile_picture')) // Should log a File object

          try {
            const { message } = await createAdminUser(formData)
            toast.success(message || 'User created successfully!')
            navigate('/admin-listing')
          } catch (error) {
            toast.error(error.message || 'Failed to create user')
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <CRow>
              <CCol lg={6}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter name"
                    className="form-control"
                  />
                  <ErrorMessage name="name" component="div" className="error-message" />
                </div>
              </CCol>
              <CCol lg={6}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email"
                    className="form-control"
                  />
                  <ErrorMessage name="email" component="div" className="error-message" />
                </div>
              </CCol>
              <CCol lg={6}>
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <Field as="select" name="gender" id="gender" className="form-control">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Field>
                  <ErrorMessage name="gender" component="div" className="error-message" />
                </div>
              </CCol>
              <CCol lg={6}>
                <div className="form-group">
                  <label htmlFor="date_of_birth">Date of Birth</label>
                  <Field
                    type="date"
                    name="date_of_birth"
                    id="date_of_birth"
                    className="form-control"
                  />
                  <ErrorMessage name="date_of_birth" component="div" className="error-message" />
                </div>
              </CCol>
              <CCol lg={6}>
                <div className="form-group">
                  <label htmlFor="role_id">Role</label>
                  <Field as="select" name="role_id" id="role_id" className="form-control">
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="role_id" component="div" className="error-message" />
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
                  <ErrorMessage name="password" component="div" className="error-message" />
                </div>
              </CCol>
              <CCol lg={6}>
                <div className="form-group">
                  <label htmlFor="profile_picture">Profile Picture</label>
                  <input
                    type="file"
                    id="profile_picture"
                    className="form-control"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0]
                      setFieldValue('profile_picture', file)
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => setPreviewImage(reader.result)
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      style={{ width: '100px', height: '100px', marginTop: '10px' }}
                    />
                  )}
                  <ErrorMessage name="profile_picture" component="div" className="error-message" />
                </div>
              </CCol>
            </CRow>
            <button type="submit" disabled={isSubmitting} className="submit-button">
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default CreateUser
