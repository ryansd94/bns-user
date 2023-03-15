import React, { useState, useEffect } from "react"
import TaskGrid from "./taskGrid"
import TaskView from "./taskView"
import TaskToolbar from "./taskToolbar"
import { Resizable } from 'components/resizable'
import { get } from "services"
import _ from "lodash"
import { baseUrl } from "configs"
import { TaskBoard } from './taskBoard'

const Task = React.memo(() => {
  const [filterModels, setFilterModels] = useState(null)
  const [customColumns, setCustomColumn] = useState(null)
  const [id, setId] = useState(null)
  const [taskTypes, setTaskType] = useState([])
  const [hidenRight, setHidenRight] = useState(false)

  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const onRowClicked = async (e) => {
    setId(e.data.id)
  }

  useEffect(() => {
    fetchCustomColumn()
    fetchTaskType()
  }, [])

  const fetchCustomColumn = async () => {
    await get(baseUrl.jm_customcolumn, { isGetAll: true }).then((data) => {
      setCustomColumn(data && data.data && data.data.items)
    })
  }

  const fetchTaskType = async () => {
    await get(baseUrl.jm_taskType, {
      isGetAll: true,
    }).then((data) => {
      setTaskType(data && data.data && data.data.items)
    })
  }

  const genderLeftComponent = () => {
    // return <TaskGrid customColumns={customColumns} onRowClicked={onRowClicked} filterModels={filterModels} />
    return <TaskBoard onRowClicked={onRowClicked} />
  }

  const genderRightComponent = () => {
    return <TaskView taskTypes={taskTypes} taskId={id} isCreate={false} />
  }

  const onFullScreen = (value) => {
    setHidenRight(value)
  }

  return (
    <div className="flex-column flex-grow overflow-hidden">
      <TaskToolbar hidenRight={hidenRight} onFullScreen={onFullScreen} taskTypes={taskTypes} customColumns={customColumns} onApplyFilter={onApplyFilter} />
      <Resizable hidenRight={hidenRight} genderRightComponent={genderRightComponent} genderLeftComponent={genderLeftComponent} />
    </div>
  )
})

export default Task
