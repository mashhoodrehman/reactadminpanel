import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const UserListing = React.lazy(() => import('./views/usersCrud/UserListing.js'))
const CreateUser = React.lazy(() => import('./views/usersCrud/CreateUser.js'))
const EditUser = React.lazy(() => import('./views/usersCrud/EditUser.js'))

const CreateRole = React.lazy(() => import('./views/RoleManagement/CreateRole.js'))
const RoleListing = React.lazy(() => import('./views/RoleManagement/RoleListing.js'))
const EditRole = React.lazy(() => import('./views/RoleManagement/EditRole.js'))

const PackageList = React.lazy(() => import('./views/packages/packageList'))
const PackageCreate = React.lazy(() => import('./views/packages/packageCreate'))
const PackageEdit = React.lazy(() => import('./views/packages/packageEdit'))

const customersList = React.lazy(() => import('./views/customers/customersList'))
const customerCreate = React.lazy(() => import('./views/customers/customerCreate'))
const customerEdit = React.lazy(() => import('./views/customers/customerEdit'))
const eventsList = React.lazy(() => import('./views/pages/events/index'))
const eventsCreate = React.lazy(() => import('./views/pages/events/create'))
const eventsEdit = React.lazy(() => import('./views/pages/events/[id]/edit'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  // User CRUD
  { path: '/user-listing', name: 'User List', element: UserListing, permission: 'view_users' },
  { path: '/user-create', name: 'Create User', element: CreateUser, permission: 'create_users' },
  { path: '/user-edit/:id', name: 'Edit User', element: EditUser, permission: 'edit_users' },

  // Role management
  { path: '/role-create-role', name: 'Role Create', element: CreateRole, permission: 'create_role' },
  { path: '/role-listing', name: 'Role List', element: RoleListing, permission: 'view_role' },
  { path: '/role-edit-role/:id', name: 'Edit Role', element: EditRole, permission: 'edit_role' },

  // Package Management
  { path: '/admin/package-list', name: 'Package List', element: PackageList },
  { path: '/admin/package-create', name: 'Create Package', element: PackageCreate },
  { path: '/admin/package-edit/:id', name: 'Edit Package', element: PackageEdit },

  // Customer Management
  { path: '/admin/customers-list', name: 'Customers List', element: customersList },
  { path: '/admin/customer-create', name: 'Create Customer', element: customerCreate },
  { path: '/admin/customers-edit/:id', name: 'Edit Customer', element: customerEdit },

  { path: '/admin/events/list', name: 'List Events', element: eventsList },
  { path: '/admin/events/create', name: 'Create Events', element: eventsCreate },
  { path: '/admin/events/:id/edit', name: 'Create Events', element: eventsEdit },
]

export default routes
