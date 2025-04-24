import React from 'react'
import { useParams } from 'react-router-dom'
import RoleForm from './roleForm'

const EditRole = () => {
  const { id } = useParams()

  return <RoleForm isEdit={true} id={id} />
}

export default EditRole
