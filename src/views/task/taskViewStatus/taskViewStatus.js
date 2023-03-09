import React, { useEffect, useState, useMemo } from "react"
import Grid from "@mui/material/Grid"
import { get } from "services"
import { baseUrl } from "configs"
import _ from "lodash"
import { DragDropContext } from "react-beautiful-dnd"
import { TaskDragElement } from './'
import Box from "@mui/material/Box"

const TaskViewStatus = React.memo((props) => {
    const { onRowClicked } = props
    const [listStatus, setStatus] = useState([])
    const [listTask, setTask] = useState([])

    useEffect(() => {
        getStatus()
        getTask()
    }, [])

    const getStatus = async () => {
        await get(baseUrl.jm_status, { isGetAll: true }).then((data) => {
            setStatus(data && data.data && data.data.items)
        })
    }

    const getTask = async () => {
        await get(baseUrl.jm_task, { isGetAll: true }).then((data) => {
            setTask(data && data.data && data.data.items)
        })
    }

    const onDragEnd = (result) => {
        if (!result.destination) {
            return
        }

        let sourceDroppableId = result.source.droppableId
        let destinationDroppableId = result.destination.droppableId

        let task = _.find(listTask, (x) => x.id === result.draggableId)
        if (!_.isNil(task)) {
            task.statusId = destinationDroppableId
            setTask([...listTask])
        }
    }

    const getElementControls = (statusId) => {
        const value = _.filter(listTask, (x) => x.statusId === statusId)
        return _.isNil(value) ? [] : value
    }

    return <Box className="task-view-container">
        <Grid container className="task-view-status-container" spacing={2} item xs={12}>
            {
                <DragDropContext onDragEnd={onDragEnd}>{
                    _.map(listStatus, (item) => {
                        return <Grid className="group" key={item.id} item>
                            <TaskDragElement
                                onRowClicked={onRowClicked}
                                prefix={item.id}
                                controls={getElementControls(item.id)}
                            />
                        </Grid>
                    })
                }
                </DragDropContext>
            }
        </Grid>
    </Box>
})

export default TaskViewStatus