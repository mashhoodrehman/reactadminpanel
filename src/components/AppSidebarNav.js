import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'
import { usePermissions } from '../helper/usePermissions' // Adjust the import path

export const AppSidebarNav = ({ items }) => {
  const { hasPermission, isSuperAdmin } = usePermissions() // Get permission checker function

  // Get user from local storage
  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null

  const navLink = (name, icon, badge, indent = false) => {
    console.log(user) // Logging user details

    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, permissions, ...rest } = item
    const Component = component

    // Show item if:
    // - It's the Dashboard (always visible)
    // - No permissions are defined (Super Admin case)
    // - User has at least one of the required permissions
    if (
      name !== 'Dashboard' &&
      !isSuperAdmin &&
      permissions?.length > 0 &&
      !permissions.some(hasPermission)
    ) {
      return null // Hide item if user lacks permission
    }

    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink {...(rest.to && { as: NavLink })} {...rest}>
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  const navGroup = (item, index) => {
    const { component, name, icon, items, permissions, ...rest } = item
    const Component = component

    // Filter items based on permissions
    const filteredItems = items?.filter(
      (subItem) => isSuperAdmin || !subItem.permissions || subItem.permissions.some(hasPermission),
    )

    // Hide group if:
    // - It has permissions and the user doesn't have them
    // - No sub-items are visible
    if (
      !isSuperAdmin &&
      permissions?.length > 0 &&
      !permissions.some(hasPermission) &&
      filteredItems.length === 0
    ) {
      return null
    }

    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {filteredItems.map((subItem, subIndex) =>
          subItem.items ? navGroup(subItem, subIndex) : navItem(subItem, subIndex, true),
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {/* Ensure Dashboard is always displayed */}
      {navItem(
        { component: 'div', name: 'Dashboard', to: '/dashboard', icon: '🏠' }, // Adjust icon if necessary
        'dashboard',
      )}

      {/* Render other sidebar items based on permissions */}
      {items &&
        items
          .filter(
            (item) => isSuperAdmin || !item.permissions || item.permissions.some(hasPermission),
          ) // Filter based on permission
          .map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
