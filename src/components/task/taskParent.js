import React from "react"
import Grid from "@mui/material/Grid"
import TaskParentItem from './taskParent/taskParentItem'
import TaskParentAddButton from './taskParent/taskParentAddButton'

const TaskParent = (props) => {

    return <Grid container xs={12} item spacing={2} direction="column">
        <Grid item style={{ width: '100%' }}>
            <TaskParentAddButton {...props} />
        </Grid>
        <Grid container xs={12} item gap={2} direction="column">
            <TaskParentItem {...props} />
        </Grid>
    </Grid>
}

export default TaskParent