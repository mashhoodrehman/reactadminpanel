import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader, AppBreadcrumb } from '../components/index'
import { CContainer } from '@coreui/react'

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <div className="header-breadcrumb mb-3">
            <AppBreadcrumb />
          </div>
          <CContainer className="px-4">
            <AppContent />
          </CContainer>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
