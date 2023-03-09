import React, { useState } from "react"
import TaskTypeGrid from "./taskTypeGrid"
import TaskTypeToolbar from "./taskTypeToolbar"
import { Resizable } from 'components/resizable'

const TaskType = React.memo(() => {
  const [filterModels, setFilterModels] = useState(null)

  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const genderLeftComponent = () => {
    return <TaskTypeGrid filterModels={filterModels} />
  }

  return (
    <div>
      <TaskTypeToolbar onApplyFilter={onApplyFilter} />
      <Resizable genderLeftComponent={genderLeftComponent} />
    </div>
  )
})

export default TaskType
