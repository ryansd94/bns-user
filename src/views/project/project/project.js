import React, { useState } from "react"
import ProjectGrid from "./projectGrid"
import ProjectBoard from "./projectBoard"
import ProjectToolbar from "./projectToolbar"
import { Resizable } from 'components/resizable'

const Project = () => {
  const [filterModels, setFilterModels] = useState(null)

  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const genderLeftComponent = () => {
    return <ProjectBoard filterModels={filterModels} />
    // return <ProjectGrid filterModels={filterModels} />
  }

  return (
    <div className="body-content">
      <ProjectToolbar onApplyFilter={onApplyFilter} />
      <Resizable genderLeftComponent={genderLeftComponent} />
    </div>
  )
}

export default Project
