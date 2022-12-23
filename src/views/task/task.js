import React, { useState, useEffect } from "react"
import TaskGrid from "./taskGrid"
import TaskView from "./taskView"
import TaskToolbar from "./taskToolbar"
import { Resizable } from 'components/resizable'
import { get } from "services"
import _ from "lodash"
import { baseUrl } from "configs"

const Task = React.memo(() => {
  const [filterModels, setFilterModels] = useState(null)
  const [customColumns, setCustomColumn] = useState(null)
  const [id, setId] = useState(null)

  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const onRowClicked = async (e) => {
    setId(e.data.id)
  }

  useEffect(() => {
    fetchCustomColumn()
  }, [])

  const fetchCustomColumn = async () => {
    await get(baseUrl.jm_customcolumn, { isGetAll: true }).then((data) => {
      setCustomColumn(data && data.data && data.data.items)
    })
  }

  const genderLeftComponent = () => {
    return <TaskGrid customColumns={customColumns} onRowClicked={onRowClicked} filterModels={filterModels} />
  }

  const genderRightComponent = () => {
    return <TaskView taskId={id} isCreate={false} />
  }

  return (
    <div>
      <TaskToolbar customColumns={customColumns} onApplyFilter={onApplyFilter} />
      <Resizable hidenRight={false} genderRightComponent={genderRightComponent} genderLeftComponent={genderLeftComponent} />
    </div>
  )
})

export default Task
