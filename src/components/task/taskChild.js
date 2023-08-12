import React from "react"
import Grid from "@mui/material/Grid"
import TaskChildListItem from './taskChild/taskChildListItem'
import TaskChildAddButton from './taskChild/taskChildAddButton'

const TaskChild = (props) => {
    const { taskId, taskTypeId } = props

    return <Grid container item gap={2} direction="column">
        <Grid item>
            <TaskChildAddButton taskId={taskId} taskTypeId={taskTypeId} />
        </Grid>
        <Grid container xs={12} item direction="column">
            <TaskChildListItem {...props} />
        </Grid>
    </Grid>
}

export default TaskChild