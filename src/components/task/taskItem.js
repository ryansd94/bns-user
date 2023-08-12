import React from "react"
import _ from "lodash"
import Grid from "@mui/material/Grid"
import StatusItem from 'views/category/status/statusItem'
import { OverflowTip } from 'components/tooltip'
import UploadIconImage from 'components/upload/uploadIcon/uploadIconImage'
import { IconX } from "components/icon/icon"
import { useTranslation } from "react-i18next"
import { cellFormatDateTime } from "helpers/commonFunction"
import { LabelControl } from 'components/label'
import { TaskTitle } from './'

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
        return <IconX onClick={() => onRemoveTaskItem(item)} />
    }

    const renderItem = () => {
        const titleRemoveIcon = <OverflowTip disableHoverListener={false} className='delete-icon-root' value={t('Delete link')} genderTooltipContent={() => renderTooltipRemoveIcon(item)} />

        return <Grid justifyContent={'center'} className='child-task-item' container gap={1} item key={item.id} direction='column'>
            <Grid style={{ width: '100%' }} container key={item.id} gap={1} direction='column'>
                <TaskTitle item={item} />
                <Grid item container gap={1} direction='row'>
                    <Grid item>
                        <LabelControl label={`${t('Updated')} ${cellFormatDateTime({ value: item.updatedDate || item.createdDate })}, `} />
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