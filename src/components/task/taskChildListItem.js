import React from "react"
import _ from "lodash"
import Grid from "@mui/material/Grid"
import { Controller } from "react-hook-form"
import { LinkControl } from 'components/link'
import LabelIconControl from 'components/label/labelIconControl'
import StatusItem from 'views/category/status/statusItem'
import { OverflowTip } from 'components/tooltip'
import UploadIconImage from 'components/upload/uploadIconImage'
import { IconDelete } from "components/icon/icon"

const TaskChildListItem = (props) => {
    const { control, name } = props

    const genderTooltipTitleContent = (title) => {
        return <span style={{ textOverflow: 'ellipsis' }}>{title}</span>
    }

    const genderTooltipTaskTypeContent = (item) => {
        return <UploadIconImage color={item.color} src={item.icon} />
    }

    const renderChildItem = (item) => {
        const titleTask = <OverflowTip value={item.title} genderTooltipContent={() => genderTooltipTitleContent(item.title)} />
        const titleTaskType = <OverflowTip disableHoverListener={false} value={item.taskType.name} genderTooltipContent={() => genderTooltipTaskTypeContent(item.taskType)} />
        const href = `/task/edit/${item.id}`
        return <Grid className='child-task-item' container key={item.id} direction='column'>
            <Grid style={{ width: '100%' }} container key={item.id} direction='column'>
                <Grid item container spacing={1} className='label-icon-control-container' direction='row'>
                    <Grid item>
                        {titleTaskType}
                    </Grid>
                    <Grid item className='label-icon-control-text'>
                        <LinkControl href={href} title={titleTask}></LinkControl>
                    </Grid>
                </Grid>
                <Grid item container spacing={1} direction='row'>
                    <Grid item>
                        <StatusItem status={item.status} />
                    </Grid>
                    <Grid item>
                    </Grid>
                </Grid>
                <IconDelete />
            </Grid>
        </Grid>
    }

    return <Controller
        render={({ field, fieldState: { error } }) =>
            <div className='child-task-root'>{
                _.map(field?.value, (item) => {
                    return !_.isNil(item) && !_.isEmpty(item) ? renderChildItem(item) : ''
                })
            }</div>}
        name={name}
        control={control && control}
    />
}

export default TaskChildListItem