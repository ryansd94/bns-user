import React from 'react'
import { useRef } from "react"
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import { useSnackbar, SnackbarContent, CustomContentProps } from "notistack"
import ButtonIcon from "components/button/ButtonIcon"
import { EButtonIconType, ENotifyObjectType } from "configs"

const TaskCommentNotify = React.forwardRef(function TaskCommentNotify(props, ref) {
    const { data, id } = props
    const { closeSnackbar } = useSnackbar()
    const { t } = useTranslation()

    return <Grid className='notify-container' ref={ref} container gap={2}>
        <Grid item className='notify-content'>
            <span><b>{data.contents[0]}</b>{t(' đã đề cập tới bạn')}</span>
        </Grid>
        <Grid item>
            <ButtonIcon className='close-notify-icon' type={EButtonIconType.close} onClick={() => closeSnackbar(id)} />
        </Grid>
    </Grid>
})

export default TaskCommentNotify