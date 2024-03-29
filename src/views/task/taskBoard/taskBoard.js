import React, { useEffect, useState } from "react"
import Grid from "@mui/material/Grid"
import { get, save } from "services"
import { baseUrl, ERROR_CODE } from "configs"
import { DragDropContext } from "react-beautiful-dnd"
import { TaskDragElement } from "."
import Box from "@mui/material/Box"
import { useSelector } from "react-redux"
import { getUserInfo } from "helpers"
import eventEmitter from "helpers/eventEmitter"
import _ from "lodash"

const TaskBoard = React.memo((props) => {
  console.log("render TaskBoard")
  const { onRowClicked, listStatus } = props
  const [listTask, setTask] = useState([])
  const [loading, setLoading] = useState(true)
  const isReload = useSelector((state) => state.master.isReload)
  const userInfo = getUserInfo()
  const getListStatusHideIds = () => {
    const hideStatusIds = userInfo?.setting?.taskSetting?.hideStatusIds || ''
    return !_.isEmpty(hideStatusIds) ? JSON.parse(hideStatusIds) : []
  }
  let [hideStatusIds, setHideStatusIds] = useState(getListStatusHideIds())

  useEffect(async () => {
    let mounted = true
    const getTask = async () => {
      await get(baseUrl.jm_task, {
        isGetAll: true,
        defaultFilters: JSON.stringify(getDefaultFilter()),
      }).then((data) => {
        setTask(data && data.data && data.data.items)
        setLoading(false)
      })
    }
    getTask()
    return () => {
      mounted = false
    }
  }, [isReload])

  const getDefaultFilter = () => {
    if (!_.isNil(userInfo.setting?.projectSetting?.currentId)) {
      return [
        {
          column: "projectId",
          condition: 0,
          value: userInfo.setting?.projectSetting?.currentId,
        },
      ]
    }
    return []
  }

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return
    }

    let sourceStatusId = result.source.droppableId
    let destinationStatusId = result.destination.droppableId

    let task = _.find(listTask, (x) => x.id === result.draggableId)
    if (!_.isNil(task)) {
      task.statusId = destinationStatusId
      setTask([...listTask])
      await save(`${baseUrl.jm_task}/status`, {
        id: task.id,
        statusId: task.statusId,
      }).then((data) => {
        if (data.errorCode !== ERROR_CODE.success) {
          task.statusId = sourceStatusId
          setTask([...listTask])
        }
      })
    }
  }

  const getElementControls = (statusId) => {
    const value = _.filter(listTask, (x) => x.statusId === statusId)
    return _.isNil(value) ? [] : value
  }

  const onChangeHiddenStatusIds = (value) => {
    setHideStatusIds(value)
  }

  useEffect(() => {
    eventEmitter.on("onChangeHiddenStatusIds", onChangeHiddenStatusIds)

    return () => {
      eventEmitter.off("onChangeHiddenStatusIds")
    }
  }, [])

  return (
    <Box className="flex-column flex-row ofx-auto ofy-hide">
      <Grid
        container
        className="task-board-container flex-row of-hidden gap"
        item
        xs={12}
      >
        {
          <DragDropContext onDragEnd={onDragEnd}>
            {_.map(
              _.orderBy(
                listStatus,
                ["isStatusStart", "isStatusEnd"],
                ["desc", "asc"],
              ),
              (item) => {
                if (_.includes(hideStatusIds, item.id)) {
                  return ''
                }
                return (
                  <TaskDragElement
                    key={item.id}
                    onRowClicked={onRowClicked}
                    item={item}
                    loading={loading}
                    controls={getElementControls(item.id)}
                  />
                )
              },
            )}
          </DragDropContext>
        }
      </Grid>
    </Box>
  )
})

export default TaskBoard
