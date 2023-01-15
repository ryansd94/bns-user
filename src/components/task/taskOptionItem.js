import React, { useEffect, useState } from "react"
import _ from "lodash"
import Grid from "@mui/material/Grid"
import { OverflowTip } from 'components/tooltip'
import UploadIconImage from 'components/upload/uploadIcon/uploadIconImage'

const TaskOptionItem = (props) => {
    const { item } = props

    const renderTooltipTitleContent = (title) => {
        return <span style={{ textOverflow: 'ellipsis' }}>{title}</span>
    }

    const renderTooltipTaskTypeContent = (item) => {
        return <UploadIconImage color={item.color} src={item.icon} />
    }

    const renderItem = () => {
        const titleTask = <OverflowTip value={item.title} genderTooltipContent={() => renderTooltipTitleContent(item.title)} />
        const titleTaskType = <OverflowTip disableHoverListener={false} value={item.taskType.name} genderTooltipContent={() => renderTooltipTaskTypeContent(item.taskType)} />

        return <Grid className='child-task-item' container item key={item.id} direction='column'>
            <Grid style={{ width: '100%' }} container direction='column'>
                <Grid item container spacing={1} className='label-icon-control-container' direction='row'>
                    <Grid item>
                        {titleTaskType}
                    </Grid>
                    <Grid item className='label-icon-control-text'>
                        {titleTask}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    }
    return (
        renderItem()
    )
}

export default TaskOptionItem