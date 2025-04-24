const initialPermissions = {
  Users: {
    view_users: 'View User',
    edit_users: 'Edit User',
  },
  Events: {
    view_events: 'View Events',
    event_detail: 'Event Detail',
  },
  Artist: {
    view_artist: 'View Artist',
    approve_artist: 'Approve Artist',
  },
  Account_Switch: {
    view_switch_request: 'View Switch Request',
    change_request_status: 'Change Request Status',
  },
  Subscription: {
    view_subscription: 'View Subscription',
    create_subscription: 'Create Subscription',
    edit_subscription: 'Edit Subscription',
    delete_subscription: 'Delete Subscription',
  },
  Genre: {
    view_genre: 'View Genre',
    create_genre: 'Create Genre',
    edit_genre: 'Edit Genre',
    delete_genre: 'Delete Genre',
  },
  Payout: {
    view_payout: 'View Payout',
    approve_payout: 'Create Payout',
  },
  Transactions: {
    view_transactions: 'View Transactions',
    approve_transactions: 'Create Transactions',
  },
  RolesPermission: {
    view_role: 'View Roles',
    create_role: 'Create Roles',
    edit_role: 'Edit Roles',
    delete_role: 'Delete Roles',
  },
  Settings: {
    view_settings: 'View Settings',
    change_platform_charges: 'Change Platform Charges',
    withdraw_charges: 'Withdraw Charges',
  },
}

export const usePermissions = () => {
  // Get user from local storage
  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null

  // Get user's permissions from local storage
  const userPermissions = user?.permissions || []

  // Check if user is Super Admin (permissions array is empty)
  const isSuperAdmin = userPermissions.length === 0

  // Function to check if the user has a specific permission
  const hasPermission = (permission) => isSuperAdmin || userPermissions.includes(permission)

  // Function to check if the user has at least one of the given permissions
  const hasAnyPermission = (permissions) =>
    isSuperAdmin || permissions.some((perm) => userPermissions.includes(perm))

  // Function to get allowed sections based on user permissions
  const getAllowedSections = () => {
    let allowedSections = {}

    Object.keys(initialPermissions).forEach((section) => {
      const allowedPermissions = Object.keys(initialPermissions[section]).filter(
        (perm) => isSuperAdmin || userPermissions.includes(perm),
      )

      if (allowedPermissions.length) {
        allowedSections[section] = allowedPermissions.map(
          (perm) => initialPermissions[section][perm],
        )
      }
    })

    return allowedSections
  }

  return { hasPermission, hasAnyPermission, getAllowedSections, isSuperAdmin }
}
