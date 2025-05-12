import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilArrowRight } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [

  {
    component: CNavTitle,
    name: 'Menu',
  },

  {
    component: CNavGroup,
    name: 'Users',
    to: '/user',
    icon: <CIcon icon={cilArrowRight} customClassName="nav-icon" />,
    permissions: ['view_users'],
    items: [
      {
        component: CNavItem,
        name: 'User List',
        to: '/user-listing',
        permissions: ['view_users'],
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Role Management',
    to: '/role',
    icon: <CIcon icon={cilArrowRight} customClassName="nav-icon" />,
    permissions: ['view_role'],
    items: [
      {
        component: CNavItem,
        name: 'Role Listing',
        to: '/role-listing',
        permissions: ['view_role'],
      },
      {
        component: CNavItem,
        name: 'Create Role',
        to: '/role-create-role',
        permissions: ['create_role'],
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Customers',
    to: '/admin/customers',
    icon: <CIcon icon={cilArrowRight} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Customers List',
        to: '/admin/customers-list',
      },
      {
        component: CNavItem,
        name: 'Create Customer',
        to: '/admin/customer-create',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Events',
    to: '/admin/events',
    icon: <CIcon icon={cilArrowRight} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Events List',
        to: '/admin/events/list',
      },
      {
        component: CNavItem,
        name: 'Events Create',
        to: '/admin/events/create',
      }
    ],
  },
  {
    component: CNavGroup,
    name: 'Tiers',
    to: '/admin/package',
    icon: <CIcon icon={cilArrowRight} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Package List',
        to: '/admin/package-list',
      },
      {
        component: CNavItem,
        name: 'Create Package',
        to: '/admin/package-create',
      },
    ],
  },
]

export default _nav
