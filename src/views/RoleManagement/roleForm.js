import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import {
  createRolePermissionAPI,
  updateAdminRoleAPI,
  getSingleAdminRolesApi,
} from '../../services/adminRolePermissionService'

// 🔐 Static permission mapping used in form
const initialPermissions = {
  Users: {
    view_users: 'View User',
    create_users: 'Create User',
    edit_users: 'Edit User',
    delete_users: 'Delete User',
  },
  Subscription: {
    view_subscription: 'View Subscription',
    create_subscription: 'Create Subscription',
    edit_subscription: 'Edit Subscription',
    delete_subscription: 'Delete Subscription',
  },
}

const RoleForm = ({ isEdit = false, id }) => {
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState({
    role_name: '',
    selectedPermissions: {},
  })
  const [loading, setLoading] = useState(isEdit)

  const SettingSchema = Yup.object().shape({
    role_name: Yup.string().required('Role name is required'),
    selectedPermissions: Yup.object().test(
      'at-least-one-selected',
      'At least one permission must be selected',
      (obj) => Object.values(obj).some((arr) => arr.length > 0)
    ),
  })

  useEffect(() => {
    if (isEdit && id) {
      const loadRole = async () => {
        try {
          const response = await getSingleAdminRolesApi(id)
          const role = response // ✅ response is an object, not an array

          const selectedPermissions = {}

          role.Permissions.forEach((perm) => {
            const category = Object.keys(initialPermissions).find((cat) =>
              Object.keys(initialPermissions[cat]).includes(perm.name)
            )
            if (category) {
              if (!selectedPermissions[category]) selectedPermissions[category] = []
              selectedPermissions[category].push(perm.name)
            }
          })

          setInitialValues({
            role_name: role.name || '',
            selectedPermissions,
          })
        } catch (error) {
          toast.error('Failed to load role details')
        } finally {
          setLoading(false)
        }
      }

      loadRole()
    }
  }, [id, isEdit])

  const handleSubmit = async (values) => {
    const payload = {
      role_name: values.role_name,
      permissions: Object.values(values.selectedPermissions).flat(),
    }

    try {
      const response = isEdit
        ? await updateAdminRoleAPI(id, payload)
        : await createRolePermissionAPI(payload)

      toast.success(response.message || 'Success')
      navigate('/role-listing') // ✅ corrected path
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="color-create-card">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={SettingSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label>Role Name</label>
              <Field name="role_name" className="form-control" />
              <ErrorMessage name="role_name" component="div" className="error-message" />
            </div>

            {Object.entries(initialPermissions).map(([category, perms]) => {
              const selected = values.selectedPermissions[category] || []
              const allSelected = selected.length === Object.keys(perms).length

              return (
                <div key={category} className="mb-3">
                  <h5>{category}</h5>
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) =>
                          setFieldValue(
                            `selectedPermissions.${category}`,
                            e.target.checked ? Object.keys(perms) : []
                          )
                        }
                      />{' '}
                      Select All
                    </label>
                  </div>

                  {Object.entries(perms).map(([key, label]) => (
                    <div key={key}>
                      <label>
                        <Field
                          type="checkbox"
                          name={`selectedPermissions.${category}`}
                          value={key}
                          checked={selected.includes(key)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...selected, key]
                              : selected.filter((perm) => perm !== key)
                            setFieldValue(`selectedPermissions.${category}`, updated)
                          }}
                        />{' '}
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              )
            })}

            <ErrorMessage name="selectedPermissions" component="div" className="error-message" />

            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                  ? 'Update Role'
                  : 'Create Role'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default RoleForm
