import React, { useState, useEffect } from "react"
import TeamDataGrid from "./TeamDataGrid"
import TeamToolbar from "./teamToolbar"
import { Resizable } from 'components/resizable'
import { baseUrl } from "configs"
import { get } from "services"

const Team = React.memo(() => {
  console.log("render Team")
  const [filterModels, setFilterModels] = useState(null)

  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const genderLeftComponent = () => {
    return <TeamDataGrid filterModels={filterModels} />
  }

  return (
    <div className="body-content">
      <TeamToolbar onApplyFilter={onApplyFilter} />
      <Resizable genderLeftComponent={genderLeftComponent} />
    </div>
  )
})

export default Team
