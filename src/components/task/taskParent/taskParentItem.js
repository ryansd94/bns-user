import React, { useEffect, useState } from "react"
import _ from "lodash"
import Grid from "@mui/material/Grid"
import { Controller } from "react-hook-form"
import TaskItem from './../taskItem'

const TaskParentItem = (props) => {
    const { control, name, setValue, getValues } = props

    const onRemoveTaskParent = () => {
        setValue(name, null)
    }

    const renderParentItem = (item) => {
        return <TaskItem item={item} onRemoveTaskItem={onRemoveTaskParent} />
    }

    return <Controller
        render={({ field, fieldState: { error } }) =>
            !_.isNil(field?.value) ? <Grid container xs={12} className='child-task-root' item spacing={2} direction="column">{
                renderParentItem(field?.value)
            }</Grid> : ''}
        name={name}
        control={control && control}
    />
}

export default TaskParentItem