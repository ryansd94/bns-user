import React, { useState } from "react"
import UserGrid from "./UserGrid"
import UserToolbar from "./UserToolbar"
import { Resizable } from 'components/resizable'

const User = React.memo(() => {
  console.log("render user")
  const [filterModels, setFilterModels] = useState(null)
  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const genderLeftComponent = () => {
    return <UserGrid filterModels={filterModels} />
  }

  return (
    <div>
      <UserToolbar onApplyFilter={onApplyFilter} />
      <Resizable genderLeftComponent={genderLeftComponent} />
    </div>
  )
})

export default User
