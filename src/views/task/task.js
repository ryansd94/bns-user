import React, { useState, useEffect, useCallback } from "react"
import TaskGrid from "./taskGrid"
import TaskView from "./taskView"
import TaskToolbar from "./taskToolbar"
import { Resizable } from 'components/resizable'
import { get, save } from "services"
import _ from "lodash"
import { baseUrl } from "configs"
import { TaskBoard } from './taskBoard'
import { getUserInfo, setUserInfo } from "helpers"
import { EViewMode } from 'configs/constants'
import Grid from "@mui/material/Grid"
import { Alert } from 'components/alert'

const Task = () => {
  console.log("render Task")
  const [filterModels, setFilterModels] = useState(null)
  const [customColumns, setCustomColumn] = useState(null)
  const [id, setId] = useState(null)
  const [taskTypes, setTaskType] = useState([])
  let user = getUserInfo()
  const [hidenRight, setHidenRight] = useState(user?.setting?.taskSetting?.isFullScreen || false)
  const [isViewList, setIsViewList] = useState(user?.setting?.taskSetting?.viewMode === EViewMode.list ? true : false)

  const onApplyFilter = useCallback((value) => {
    setFilterModels(value)
  }, [])

  const onRowClicked = async (e) => {
    setId(e.data.id)
  }

  useEffect(() => {
    let mounted = true
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

    fetchCustomColumn()
    fetchTaskType()
    return () => { mounted = false }
  }, [])

  const genderLeftComponent = useCallback(() => {
    return isViewList === true ? <TaskGrid customColumns={customColumns} onRowClicked={onRowClicked} filterModels={filterModels} /> : <TaskBoard onRowClicked={onRowClicked} />
  }, [filterModels, isViewList])

  const genderRightComponent = useCallback(() => {
    return <TaskView taskTypes={taskTypes} taskId={id} isCreate={false} />
  }, [id])

  const onFullScreen = useCallback((value) => {
    setHidenRight(value)
    save(`${baseUrl.jm_user}/me`, { id: user.userId, configs: [{ key: 'TaskSetting.IsFullScreen', value: value }] })
    user.setting.taskSetting.isFullScreen = value
    setUserInfo({ user: user })
  }, [hidenRight])

  const onChangeViewMode = useCallback(async (value) => {
    setIsViewList(value)
    const viewMode = value === true ? EViewMode.list : EViewMode.board
    user.setting.taskSetting.viewMode = viewMode
    setUserInfo({ user: user })
    save(`${baseUrl.jm_user}/me`, { id: user.userId, configs: [{ key: 'TaskSetting.ViewMode', value: viewMode }] })
  }, [isViewList])

  return (
    <div className="body-content">
      <TaskToolbar isViewList={isViewList} hidenRight={hidenRight} onChangeViewMode={onChangeViewMode} onFullScreen={onFullScreen} taskTypes={taskTypes} customColumns={customColumns} onApplyFilter={onApplyFilter} />
      <Resizable hidenRight={hidenRight} genderRightComponent={genderRightComponent} genderLeftComponent={genderLeftComponent} />
    </div>
  )
}

export default Task
