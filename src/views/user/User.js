import React, { useState } from "react"
import UserGrid from "./UserGrid"
import UserToolbar from "./UserToolbar"
import { Resizable } from 'components/resizable'

const User = React.memo(() => {
  const [filterModels, setFilterModels] = useState(null)
  const gridId = 'gridUser'
  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const genderLeftComponent = () => {
    return <UserGrid id={gridId} filterModels={filterModels} />
  }

  return (
    <div className="body-content">
      <UserToolbar gridId={gridId} onApplyFilter={onApplyFilter} />
      <Resizable genderLeftComponent={genderLeftComponent} />
    </div>
  )
})

export default User
