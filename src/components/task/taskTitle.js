import React from "react"
import _ from "lodash"
import Grid from "@mui/material/Grid"
import { LinkControl } from 'components/link'
import { OverflowTip } from 'components/tooltip'
import UploadIconImage from 'components/upload/uploadIcon/uploadIconImage'
import { useTranslation } from "react-i18next"

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
        const titleTask = <OverflowTip value={item.title} genderTooltipContent={() => renderTooltipTitleContent(item.title)} />
        const titleTaskType = <OverflowTip disableHoverListener={false} value={item.taskType.name} genderTooltipContent={() => renderTooltipTaskTypeContent(item.taskType)} />

        const href = `/task/edit/${item.id}`
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