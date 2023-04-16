import React, { useState } from "react"
import PermissionToolbar from "./permissionToolbar"
import { Resizable } from 'components/resizable'

const Permission = () => {
  const [filterModels, setFilterModels] = useState(null)

  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const genderLeftComponent = () => {
    return ''
  }

  return (
    <div className="body-content">
      <PermissionToolbar onApplyFilter={onApplyFilter} />
      <Resizable className='' genderLeftComponent={genderLeftComponent} />
    </div>
  )
}

export default Permission
