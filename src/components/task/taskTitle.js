import React from "react"
import _ from "lodash"
import Grid from "@mui/material/Grid"
import { LinkControl } from 'components/link'
import { OverflowTip } from 'components/tooltip'
import UploadIconImage from 'components/upload/uploadIcon/uploadIconImage'
import { useTranslation } from "react-i18next"
import { getPathItem } from "helpers"

const TaskTitle = (props) => {
    const { item, isRenderTaskLink = true } = props
    const { t } = useTranslation()

    const renderTooltipTitleContent = (title) => {
        return <span style={{ textOverflow: 'ellipsis' }}>{title}</span>
    }

    const renderTooltipTaskTypeContent = (item) => {
        return <UploadIconImage color={item.color} src={item.icon} />
    }

    const renderItem = () => {
        const titleTask = <OverflowTip value={item.title} renderTooltipContent={() => renderTooltipTitleContent(item.title)} />
        const titleTaskType = <OverflowTip disableHoverListener={false} value={item.taskType.name} renderTooltipContent={() => renderTooltipTaskTypeContent(item.taskType)} />

        const href = getPathItem(`/task/edit/${item.id}`)
        return <Grid item container gap={1} className='label-icon-control-container' direction='row'>
            <Grid item>
                {titleTaskType}
            </Grid>
            <Grid item className='label-icon-control-text'>
                {isRenderTaskLink ? <LinkControl href={href} title={titleTask}></LinkControl> : <span>{titleTask}</span>}
            </Grid>
        </Grid>
    }
    return (
        renderItem()
    )
}

export default TaskTitle