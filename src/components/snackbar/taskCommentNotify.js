import React from 'react'
import { useRef } from "react"
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import { useSnackbar, SnackbarContent, CustomContentProps } from "notistack"
import ButtonIcon from "components/button/ButtonIcon"
import { EButtonIconType, ENotifyObjectType } from "configs"
import LabelIconControl from 'components/label/labelIconControl'

const TaskCommentNotify = React.forwardRef(function TaskCommentNotify(props, ref) {
    const { data, id } = props
    const { closeSnackbar } = useSnackbar()
    const { t } = useTranslation()

    const renderTaskItem = () => {
        return <Grid container gap={1}>
            <Grid item>
                <LabelIconControl icon={data.content.TaskContent.TaskType.Icon} color={data.content.TaskContent.TaskType.Color} />
            </Grid>
            <Grid item>
                {data.content.TaskContent.Title}
            </Grid>
        </Grid>
    }

    return <Grid className='notify-container' ref={ref} container gap={2}>
        <Grid item className='notify-content'>
            <span><b className='notify-mention'>{data.content.UserMentionName}</b><span className='notify-title'>{t(' đã đề cập tới bạn trong ')}</span>{renderTaskItem()}</span>
        </Grid>
        <Grid item>
            <ButtonIcon className='close-notify-icon' type={EButtonIconType.close} onClick={() => closeSnackbar(id)} />
        </Grid>
    </Grid>
})

export default TaskCommentNotify