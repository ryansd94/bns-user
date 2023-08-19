import React, { useState } from "react"
import UserGrid from "./UserGrid"
import UserToolbar from "./UserToolbar"
import { Resizable } from 'components/resizable'

const User = React.memo(() => {
  const [filterModels, setFilterModels] = useState(null)
  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const genderLeftComponent = () => {
    return <UserGrid filterModels={filterModels} />
  }

  return (
    <div className="body-content">
      <UserToolbar onApplyFilter={onApplyFilter} />
      <Resizable genderLeftComponent={genderLeftComponent} />
    </div>
  )
})

export default User
