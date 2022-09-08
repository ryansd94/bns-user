import React, { useState, useEffect, useCallback } from "react"
import TemplateToolbar from "./TemplateToolbar"
import TemplateGrid from "./templateGrid"
import { Resizable } from 'components/resizable'


const Template = React.memo(() => {
  console.log("render Template")
  const [filterModels, setFilterModels] = useState(null)

  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const genderLeftComponent = () => {
    return <TemplateGrid filterModels={filterModels} />
  }

  return (
    <div>
      <TemplateToolbar onApplyFilter={onApplyFilter} />
      <Resizable genderLeftComponent={genderLeftComponent} />
    </div>
  )
})

export default Template
