import React, { useEffect, useState } from "react"
import _ from "lodash"
import Grid from "@mui/material/Grid"
import { LinkControl } from 'components/link'
import StatusItem from 'views/category/status/statusItem'
import { OverflowTip } from 'components/tooltip'
import UploadIconImage from 'components/upload/uploadIcon/uploadIconImage'
import { IconDelete } from "components/icon/icon"
import { useTranslation } from "react-i18next"
import { cellFormatDateTime } from "helpers/commonFunction"
import { LabelControl } from 'components/label'

const TaskItem = (props) => {
    const { item, onRemoveTaskItem } = props
    const { t } = useTranslation()

    const renderTooltipTitleContent = (title) => {
        return <span style={{ textOverflow: 'ellipsis' }}>{title}</span>
    }

    const renderTooltipTaskTypeContent = (item) => {
        return <UploadIconImage color={item.color} src={item.icon} />
    }

    const renderTooltipRemoveIcon = (item) => {
        return <IconDelete onClick={() => onRemoveTaskItem(item)} className='delete-icon' />
    }

    const renderItem = () => {
        const titleTask = <OverflowTip value={item.title} genderTooltipContent={() => renderTooltipTitleContent(item.title)} />
        const titleTaskType = <OverflowTip disableHoverListener={false} value={item.taskType.name} genderTooltipContent={() => renderTooltipTaskTypeContent(item.taskType)} />
        const titleRemoveIcon = <OverflowTip disableHoverListener={false} className='delete-icon-root' value={t('Xóa liên kết')} genderTooltipContent={() => renderTooltipRemoveIcon(item)} />

        const href = `/task/edit/${item.id}`
        return <Grid className='child-task-item' container item key={item.id} direction='column'>
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
                        <LabelControl label={`${t('Cập nhật')} ${cellFormatDateTime({ value: item.updatedDate || item.createdDate })}, `} />
                    </Grid>
                    <Grid item>
                        <StatusItem status={item.status} />
                    </Grid>
                </Grid>
            </Grid>
            {titleRemoveIcon}
        </Grid>
    }
    return (
        renderItem()
    )
}

export default TaskItem