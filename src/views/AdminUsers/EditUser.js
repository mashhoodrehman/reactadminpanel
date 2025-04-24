import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getAllRoles,
  getSingleAdminUser,
  updateAdminUserAPI,
} from '../../services/AdminUserService'
import { CCol, CRow } from '@coreui/react'

const CreateUser = () => {
  const ImageUrl = import.meta.env.VITE_IMAGE_BASE_URL
  const navigate = useNavigate()
  const { id } = useParams()
  const [roles, setRoles] = useState([])
  const [userData, setUserData] = useState(null)
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

  useEffect(() => {
    const fetchSingleUser = async () => {
      if (!id) return
      try {
        const response = await getSingleAdminUser(id)
        setUserData(response?.data)
        setPreviewImage(response?.data?.profile_picture)
      } catch (error) {
        toast.error('Failed to load user data')
      }
    }
    fetchSingleUser()
  }, [id])

  const UserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    gender: Yup.string().required('Gender is required'),
    date_of_birth: Yup.date().required('Date of Birth is required'),
    role_id: Yup.string().required('Role is required'),
    password: id
      ? Yup.string()
      : Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
    profile_picture: Yup.mixed().nullable(),
  })

  return (
    <div className="brand-create-card">
      {userData && (
        <Formik
          initialValues={{
            name: userData.name || '',
            email: userData.email || '',
            gender: userData.gender || '',
            date_of_birth: userData.date_of_birth ? userData.date_of_birth.split('T')[0] : '',
            profile_picture: null,
            role_id: userData.roles?.[0]?.id || '',
            password: '',
          }}
          validationSchema={UserSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const formData = new FormData()
            Object.keys(values).forEach((key) => {
              if (key === 'profile_picture' && values[key]) {
                formData.append(key, values[key], values[key].name)
              } else {
                formData.append(key, values[key])
              }
            })

            try {
              const { message } = await updateAdminUserAPI(id, formData)
              toast.success(message || 'User updated successfully!')
              navigate('/admin-listing')
            } catch (error) {
              toast.error(error.message || 'Failed to update user')
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
                    <Field type="text" name="name" className="form-control" />
                    <ErrorMessage name="name" component="div" className="error-message" />
                  </div>
                </CCol>
                <CCol lg={6}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field type="email" name="email" className="form-control" />
                    <ErrorMessage name="email" component="div" className="error-message" />
                  </div>
                </CCol>
                <CCol lg={6}>
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <Field as="select" name="gender" className="form-control">
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
                    <Field type="date" name="date_of_birth" className="form-control" />
                    <ErrorMessage name="date_of_birth" component="div" className="error-message" />
                  </div>
                </CCol>
                <CCol lg={6}>
                  <div className="form-group">
                    <label htmlFor="role_id">Role</label>
                    <Field as="select" name="role_id" className="form-control">
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
                        src={
                          previewImage.startsWith('data')
                            ? previewImage
                            : `${ImageUrl}/${previewImage}`
                        }
                        alt="Profile Preview"
                        style={{ width: '100px', height: '100px', marginTop: '10px' }}
                      />
                    )}
                  </div>
                </CCol>
              </CRow>
              <button type="submit" disabled={isSubmitting} className="submit-button">
                {isSubmitting ? 'Updating...' : 'Update User'}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  )
}

export default CreateUser
